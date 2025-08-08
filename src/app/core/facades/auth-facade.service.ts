import {inject, Injectable} from '@angular/core';
import {finalize, Observable, tap} from 'rxjs';

import {AuthService} from '../services/auth.service';
import {AuthStore} from '../stores/auth.store';
import {AuthFormService} from '../../features/auth/services/auth-form.service';
import {AuthResponse} from '../../shared/models/auth-response.model';
import {STORAGE} from '../../shared/constants/storage.constants';
import {LoginFormGroup, LoginFormValues} from '../../shared/models/login-form.model';

/**
 * Facade for authentication operations that coordinates between auth service and store
 * Provides a simplified API for components to use for auth-related operations
 */
@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService: AuthService = inject(AuthService);
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly formService = inject(AuthFormService);

  readonly isAuthenticated = this.authStore.isAuthenticated.asReadonly();
  readonly loading = this.authStore.loading.asReadonly();
  readonly user = this.authStore.user.asReadonly();

  /**
   * Initialize the authentication state based on stored token
   */
  initializeAuth(): void {
    const token = localStorage.getItem(STORAGE.AUTH_TOKEN);

    if (token) {
      this.authStore.setAuthenticated({ id: 0, username: '', role: '' }); // Placeholder user
    } else {
      this.authStore.clearAuthentication();
    }
  }

  /**
   * Creates a form group for login with required validators
   */
  createLoginForm(): LoginFormGroup {
    return this.formService.createLoginForm();
  }

  /**
   * Prepares login data from form values for submission
   */
  prepareLoginData(formValues: LoginFormValues): LoginFormValues {
    return this.formService.prepareLoginData(formValues);
  }

  /**
   * Authenticates user with provided credentials
   * Updates auth state on success and manages loading state
   */
  login(username: string, password: string): Observable<AuthResponse> {
    this.authStore.setLoading(true);

    return this.authService.login(username, password).pipe(
      tap((response: AuthResponse) => {
        this.saveToken(response.token);
        this.authStore.setAuthenticated(response.user);
      }),
      finalize(() => {
        this.authStore.setLoading(false);
      })
    );
  }

  /**
   * Logs out the current user and clears authentication state
   */
  logout(): void {
    this.clearToken();
    this.authStore.clearAuthentication();
  }

  /**
   * Gets the current auth token from storage
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE.AUTH_TOKEN);
  }

  // Private methods
  /**
   * Save the authentication token to local storage
   */
  private saveToken(token: string): void {
    localStorage.setItem(STORAGE.AUTH_TOKEN, token);
  }

  /**
   * Clear the authentication token from local storage
   */
  private clearToken(): void {
    localStorage.removeItem(STORAGE.AUTH_TOKEN);
  }
}
