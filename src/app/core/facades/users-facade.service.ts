import {inject, Injectable} from '@angular/core';
import {UserStore} from '../stores/users.store';
import {UsersService} from '../services/users.service';
import {catchError, finalize, map, Observable, of, tap} from 'rxjs';
import {UserFormService} from '../../features/users/services/user-form.service';
import {CreateUserDto, UpdateUserDto, User} from '../../shared/models/user.model';
import {UserFormGroup, UserFormValues} from '../../shared/models/forms/user-form.model';

// Define a result type for operations that can succeed or fail
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class UsersFacadeService {
  private store = inject(UserStore);
  private api = inject(UsersService);
  private formService = inject(UserFormService);

  // Expose state as readonly signals
  users = this.store.users.asReadonly();
  loading = this.store.loading.asReadonly();
  error = this.store.error.asReadonly();

  // User service methods
  loadUsers(): void {
    this.store.setLoading(true);
    this.api.getUsers().pipe(
      tap(users => {
        this.store.setUsers(users);
        this.store.setError('');
      }),
      finalize(() => this.store.setLoading(false)),
    ).subscribe({
      error: err => {
        this.store.setError('Failed to load users');
      },
    });
  }

  /**
   * Get a user by ID
   * @param id The ID of the user to fetch
   * @returns An Observable of the user
   */
  getUserById(id: string): Observable<User> {
    this.store.setLoading(true);
    return this.api.getUserById(id).pipe(
      tap(() => this.store.setError('')),
      finalize(() => this.store.setLoading(false))
    );
  }

  /**
   * Create or update a user
   * @param userData The user data to save or update
   * @returns Observable with operation result
   */
  saveUser(userData: CreateUserDto | UpdateUserDto): Observable<OperationResult<User>> {
    this.store.setLoading(true);

    // Determine if this is a create or update operation based on presence of id
    const isUpdate = 'id' in userData && !!userData.id;

    // Call the appropriate API method
    const apiCall = isUpdate
      ? this.api.editUser(userData as UpdateUserDto)
      : this.api.addUser(userData as CreateUserDto);

    // Process the response
    return apiCall.pipe(
      map(savedUser => {
        this.store.upsertUser(savedUser);
        this.store.setError('');
        return { success: true, data: savedUser };
      }),
      catchError(error => {
        const action = isUpdate ? 'update' : 'create';
        const errorMessage = `Failed to ${action} user. Please check your data and try again.`;
        this.store.setError(errorMessage);
        return of({ success: false, error: errorMessage });
      }),
      finalize(() => this.store.setLoading(false))
    );
  }

  // Form service methods
  createUserForm(user: User | null = null): UserFormGroup {
    return this.formService.createUserForm(user);
  }

  prepareUserData(formValues: UserFormValues, userId?: string): CreateUserDto | UpdateUserDto {
    return this.formService.prepareUserData(formValues, userId);
  }
}
