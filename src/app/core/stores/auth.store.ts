import {Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthUser} from '../../shared/models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authState$ = new BehaviorSubject<{ isAuthenticated: boolean, user: AuthUser | null }>({
    isAuthenticated: false,
    user: null
  });

  readonly isAuthenticated = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly user = signal<AuthUser | null>(null);

  /**
   * Set the loading state
   * @param value Loading state boolean
   */
  setLoading(value: boolean): void {
    this.loading.set(value);
  }

  /**
   * Set authenticated state with user data
   * @param user The authenticated user's data
   */
  setAuthenticated(user: AuthUser): void {
    this.authState$.next({
      isAuthenticated: true,
      user
    });
    this.isAuthenticated.set(true);
    this.user.set(user);
  }

  /**
   * Clear authentication state
   */
  clearAuthentication(): void {
    this.authState$.next({
      isAuthenticated: false,
      user: null
    });
    this.isAuthenticated.set(false);
    this.user.set(null);
  }
}
