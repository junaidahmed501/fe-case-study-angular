import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, User} from '../../shared/models/user.model';
import {environment} from '../../../environments/environment';
import {API} from '../../shared/constants/api.constants';

/**
 * Service responsible for user data API operations
 * Handles HTTP requests to the users endpoints
 */
@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = `${environment.apiBaseUrl}/${API.USERS_BASE}`;

  /**
   * Fetches all users from the API
   * @returns Observable of users array
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Fetches a specific user by ID from the API
   * @param id User ID to retrieve
   * @returns Observable of the requested user
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new user via the API
   * @param userData User creation data
   * @returns Observable of the created user
   */
  addUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${environment.apiBaseUrl}/${API.USERS_CREATE}`, userData);
  }

  /**
   * Updates an existing user via the API
   * @param userData User data with ID for update
   * @returns Observable of the updated user
   */
  editUser(userData: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userData?.id}`, userData);
  }
}
