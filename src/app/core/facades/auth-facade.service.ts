import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { AuthStore } from '../stores/auth.store';
import { AuthResponse } from '../../shared/models/auth';

@Injectable({ providedIn: 'root' })
export class AuthFacadeService {
  private readonly authService: AuthService = inject(AuthService);
  private readonly authStore: AuthStore = inject(AuthStore);
  private readonly router: Router = inject(Router);

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
    const token = this.authService.getToken();
    if (token) {
      // If we have token, we consider the user authenticated
      // In a real app, you might want to validate the token with the server or decode it to get user info
      this.authStore.setAuthenticated({ id: 0, username: '', role: '' }); // Placeholder user
    }
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
        this.authService.saveToken(response.token);
        this.authStore.setAuthenticated(response.user);
        this.router.navigate(['/users']);
      })
    );
  }

  /**
   * Logout the user
   */
  logout(): void {
    this.authService.clearToken();
    this.authStore.clearAuthentication();
    this.router.navigate(['/auth']);
  }

  /**
   * Check if the user is authenticated
   * @returns True if authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.authService.getToken();
  }
}
