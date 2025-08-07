import {inject, Injectable} from '@angular/core';
import {UserStore} from '../stores/users.store';
import {UsersService} from '../services/users.service';
import {User} from '../../shared/models/user';
import {catchError, finalize, map, Observable, of, tap} from 'rxjs';
import {UserFormService} from '../../features/users/services/user-form.service';
import {FormGroup} from '@angular/forms';
import {UserFormGroupModel} from '../../shared/models/forms/user-form-group.model';
import {UserFormModel} from '../../shared/models/forms/user-form.model';
import {UserToSave} from '../../shared/models/forms/user-form-to-save.model';

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
   * Save a new user with simplified error handling
   * @param user The user data to save
   * @returns Observable with operation result
   */
  saveUser(user: UserToSave): Observable<OperationResult<User>> {
    this.store.setLoading(true);

    return this.api.addUser(user).pipe(
      map(savedUser => {
        this.store.upsertUser(savedUser);
        this.store.setError('');
        return { success: true, data: savedUser };
      }),
      catchError(error => {
        const errorMessage = 'Failed to create user. The username may already exist.';
        this.store.setError(errorMessage);
        return of({ success: false, error: errorMessage });
      }),
      finalize(() => this.store.setLoading(false))
    );
  }

  /**
   * Edit an existing user with simplified error handling
   * @param user The user data to update
   * @returns Observable with operation result
   */
  editUser(user: Partial<User>): Observable<OperationResult<User>> {
    this.store.setLoading(true);

    return this.api.editUser(user).pipe(
      map(updatedUser => {
        this.store.upsertUser(updatedUser);
        this.store.setError('');
        return { success: true, data: updatedUser };
      }),
      catchError(error => {
        const errorMessage = 'Failed to update user. Please check your data and try again.';
        this.store.setError(errorMessage);
        return of({ success: false, error: errorMessage });
      }),
      finalize(() => this.store.setLoading(false))
    );
  }

  // Form service methods
  createUserForm(user: User | null = null): FormGroup<UserFormGroupModel> {
    return this.formService.createUserForm(user);
  }

  prepareUserDataToSave(formValue: UserFormModel): UserToSave {
    return this.formService.prepareUserDataToSave(formValue);
  }

  prepareUserDataToUpdate(id: string, formValue: UserFormModel): Partial<User> {
    return this.formService.prepareUserDataToUpdate(id, formValue);
  }
}
