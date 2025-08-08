import {inject, Injectable, signal} from '@angular/core';
import {Observable, tap} from 'rxjs';

import {AuthService} from '../services/auth.service';
import {AuthStore} from '../stores/auth.store';
import {AuthFormService} from '../../features/auth/services/auth-form.service';
import {LoginFormGroup, LoginFormValues} from '../../shared/models/forms/login-form.model';
import {AuthResponse} from '../../shared/models/auth-response.model';
import {STORAGE} from '../../shared/constants/storage.constants';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService: AuthService = inject(AuthService);
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly formService = inject(AuthFormService);

  // Authentication state as a signal - will be exposed for components to consume
  readonly isAuthenticated = signal<boolean>(false);

  get isAuthenticated$(): Observable<boolean> {
    return this.authStore.isAuthenticated$;
  }

  /**
   * Initialize the authentication state based on the stored token
   * Should be called once during app initialization
   */
  initializeAuth(): void {
    const token = localStorage.getItem(STORAGE.AUTH_TOKEN);

    if (token) {
      // If we have token, we consider the user authenticated
      this.authStore.setAuthenticated({ id: 0, username: '', role: '' }); // Placeholder user
      this.isAuthenticated.set(true);
    } else {
      this.authStore.clearAuthentication();
      this.isAuthenticated.set(false);
    }

    // Subscribe to future auth state changes to keep signal in sync
    this.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated.set(isAuthenticated);
    });
  }

  /**
   * Creates a form group for login
   */
  createLoginForm(): LoginFormGroup {
    return this.formService.createLoginForm();
  }

  /**
   * Prepares login data from form values
   */
  prepareLoginData(formValues: LoginFormValues): LoginFormValues {
    return this.formService.prepareLoginData(formValues);
  }

  /**
   * Login the user
   * @param username - The username
   * @param password - The password
   * @returns An observable of the authentication response
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.authService.login(username, password).pipe(
      tap((response: AuthResponse) => {
        this.saveToken(response.token);
        this.authStore.setAuthenticated(response.user);
        // Signal is updated via subscription to isAuthenticated$
      })
    );
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.clearToken();
    this.authStore.clearAuthentication();
    // Signal is updated via subscription to isAuthenticated$
  }

  /**
   * Get the authentication token from local storage
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
