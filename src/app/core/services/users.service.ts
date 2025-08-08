import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, User} from '../../shared/models/user.model';
import {environment} from '../../../environments/environment';
import {USERS_API} from '../../shared/constants/api';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = `${environment.apiBaseUrl}/${USERS_API.BASE}`;

  /**
   * Get all users from the API
   * @returns Observable of users array
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Get a specific user by ID
   * @param id The ID of the user to fetch
   * @returns Observable of the requested user
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Add a new user
   * @param userData The user data to create
   * @returns Observable of the created user
   */
  addUser(userData: CreateUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${USERS_API.CREATE}`, userData);
  }

  /**
   * Update an existing user
   * @param userData The user data to update
   * @returns Observable of the updated user
   */
  editUser(userData: UpdateUserDto): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userData?.id}`, userData);
  }
}
