import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../../shared/models/auth';

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly authState$ = new BehaviorSubject<{ isAuthenticated: boolean, user: AuthResponse['user'] | null }>({
    isAuthenticated: false,
    user: null
  });

  get isAuthenticated$(): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.authState$.subscribe(state => {
        observer.next(state.isAuthenticated);
      });
    });
  }

  get currentUser$(): Observable<AuthResponse['user'] | null> {
    return new Observable<AuthResponse['user'] | null>(observer => {
      this.authState$.subscribe(state => {
        observer.next(state.user);
      });
    });
  }

  setAuthenticated(user: AuthResponse['user']): void {
    this.authState$.next({
      isAuthenticated: true,
      user
    });
  }

  clearAuthentication(): void {
    this.authState$.next({
      isAuthenticated: false,
      user: null
    });
  }
}
