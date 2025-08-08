import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AUTH_API} from '../../shared/constants/api';
import {STORAGE_KEYS} from '../../shared/constants/storage.constants';
import {AuthResponse} from '../../shared/models/auth-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly loginUrl: string = `${environment.apiBaseUrl}/${AUTH_API.LOGIN}`;
  private readonly tokenKey: string = STORAGE_KEYS.AUTH_TOKEN;

  /**
   * Login method to authenticate a user.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns {Observable<AuthResponse>} Authentication token and user details.
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, { username, password });
  }

  /**
   * Save auth token to local storage
   * @param token - The token to save
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Get auth token from local storage
   * @returns The stored token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Remove auth token from local storage
   */
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
