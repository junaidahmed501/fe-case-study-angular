import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../../shared/models/user';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http: HttpClient = inject(HttpClient);

  private readonly apiUrl: string = `${environment.apiBaseUrl}/${environment.endpoints.users.base}`

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${ this.apiUrl }/${ id }`);
  }

  addUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  editUser(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${ this.apiUrl }/${ user?.id }`, user);
  }
}
