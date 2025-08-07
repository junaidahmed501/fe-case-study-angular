import {inject, Injectable} from '@angular/core';
import {UserStore} from '../stores/users.store';
import {UsersService} from '../services/users.service';
import {User} from '../../shared/models/user';
import {finalize, Observable, tap} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersFacadeService {
  private store = inject(UserStore);
  private api = inject(UsersService);

  users = this.store.users.asReadonly();
  loading = this.store.loading.asReadonly();
  error = this.store.error.asReadonly();

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

  saveUser(user: Partial<User>): void {
    const action = user.id ? this.api.editUser(user) : this.api.addUser(user);
    this.store.setLoading(true);

    action.subscribe({
      next: (saved) => {
        this.store.upsertUser(saved);
        this.store.setLoading(false);
      },
      error: () => {
        this.store.setError('Failed to save user');
        this.store.setLoading(false);
      }
    });
  }
}
