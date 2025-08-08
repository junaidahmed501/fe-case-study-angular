import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {API} from '../../shared/constants/api.constants';
import {STORAGE} from '../../shared/constants/storage.constants';
import {AuthResponse} from '../../shared/models/auth-response.model';

/**
 * Service responsible for authentication operations
 * Handles API interactions for login and token management
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly loginUrl: string = `${environment.apiBaseUrl}/${API.AUTH_LOGIN}`;
  private readonly tokenKey: string = STORAGE.AUTH_TOKEN;

  /**
   * Authenticates user with the backend
   * @param username - User's username
   * @param password - User's password
   * @returns Authentication response with token and user data
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, { username, password });
  }
}
