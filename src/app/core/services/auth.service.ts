import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly authUrl: string = environment.apiEndpoints.auth;

  /**
   * Login method to authenticate a user.
   * @param username - The username of the user.
   * @param password - The password of the user.
   * @returns An Observable of AuthResponse containing the authentication token and user details.
   */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.authUrl, { username, password });
  }
}
