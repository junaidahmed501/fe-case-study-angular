import { Routes } from '@angular/router';
import { USERS_PATH } from './features/users/users.routes';

// todo: convert them to standalone routes
// https://angular.io/guide/standalone-components#standalone-routes

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: USERS_PATH,
    loadChildren: () => import('./features/users/users.routes').then(r => r.USERS_ROUTES),
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
]
