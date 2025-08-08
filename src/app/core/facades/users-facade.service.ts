import {inject, Injectable} from '@angular/core';
import {UserStore} from '../stores/users.store';
import {UsersService} from '../services/users.service';
import {catchError, finalize, map, Observable, of, tap} from 'rxjs';
import {UserFormService} from '../../features/users/services/user-form.service';
import {CreateUserDto, UpdateUserDto, User} from '../../shared/models/user.model';
import {UserFormGroup, UserFormValues} from '../../shared/models/forms/user-form.model';

/**
 * Represents the result of user operations that can succeed or fail
 */
export interface OperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Facade for user management operations
 * Coordinates between user service, store, and form service
 * Provides a unified API for components to interact with
 */
@Injectable({ providedIn: 'root' })
export class UsersFacadeService {
  private readonly store = inject(UserStore);
  private readonly api = inject(UsersService);
  private readonly formService = inject(UserFormService);

  readonly users = this.store.users.asReadonly();
  readonly loading = this.store.loading.asReadonly();
  readonly error = this.store.error.asReadonly();

  /**
   * Fetches all users from the API and updates the store
   * Sets loading state and handles errors
   */
  loadUsers(): void {
    this.store.setLoading(true);
    this.api.getUsers().pipe(
      tap(users => {
        this.store.setUsers(users);
        this.store.setError('');
      }),
      finalize(() => this.store.setLoading(false)),
    ).subscribe({
      error: () => {
        this.store.setError('Failed to load users');
      },
    });
  }

  /**
   * Fetches a specific user by ID
   * @param id User ID to retrieve
   * @returns Observable of the user data
   */
  getUserById(id: string): Observable<User> {
    this.store.setLoading(true);
    return this.api.getUserById(id).pipe(
      tap(() => this.store.setError('')),
      finalize(() => this.store.setLoading(false))
    );
  }

  /**
   * Creates or updates a user based on provided data
   * @param userData User data for create/update operation
   * @returns Observable with operation result
   */
  saveUser(userData: CreateUserDto | UpdateUserDto): Observable<OperationResult<User>> {
    this.store.setLoading(true);

    const isUpdate = 'id' in userData && !!userData.id;
    const apiCall = isUpdate
      ? this.api.editUser(userData as UpdateUserDto)
      : this.api.addUser(userData as CreateUserDto);

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

  /**
   * Creates a user form with optional initial data
   * @param user User data to populate the form with
   * @returns Typed form group for user operations
   */
  createUserForm(user: User | null = null): UserFormGroup {
    return this.formService.createUserForm(user);
  }

  /**
   * Prepares user data from form values for API submission
   * @param formValues Values from the user form
   * @param userId Optional ID for update operations
   * @returns Data object ready for API submission
   */
  prepareUserData(formValues: UserFormValues, userId?: string): CreateUserDto | UpdateUserDto {
    return this.formService.prepareUserData(formValues, userId);
  }
}
