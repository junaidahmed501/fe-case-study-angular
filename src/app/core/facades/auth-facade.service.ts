import {inject, Injectable} from '@angular/core';
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

  get isAuthenticated$(): Observable<boolean> {
    return this.authStore.isAuthenticated$;
  }

  get currentUser$(): Observable<AuthResponse['user'] | null> {
    return this.authStore.currentUser$;
  }

  /**
   * Initialize the authentication state based on the stored token
   */
  initializeAuth(): void {
    const token = this.getToken();
    if (token) {
      // If we have token, we consider the user authenticated
      // In a real app, you might want to validate the token with the server or decode it to get user info
      this.authStore.setAuthenticated({ id: 0, username: '', role: '' }); // Placeholder user
    }
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
      })
    );
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.clearToken();
    this.authStore.clearAuthentication();
  }

  /**
   * Check if the user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Get the authentication token from local storage
   */
  getToken(): string | null {
    return localStorage.getItem(STORAGE.AUTH_TOKEN);
  }

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
