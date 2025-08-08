import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {AuthUser} from '../../shared/models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authState$ = new BehaviorSubject<{ isAuthenticated: boolean, user: AuthUser | null }>({
    isAuthenticated: false,
    user: null
  });

  /*
    * Signal to track authentication state.
    * Not implemented due to time constraints
   */
  // readonly loading = signal(false);

  get isAuthenticated$(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.authState$.subscribe(state => {
        observer.next(state.isAuthenticated);
      });
    });
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
  }

  /**
   * Clear authentication state
   */
  clearAuthentication(): void {
    this.authState$.next({
      isAuthenticated: false,
      user: null
    });
  }
}
