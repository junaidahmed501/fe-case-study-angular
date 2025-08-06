import { Routes } from '@angular/router';
import { USERS_PATH } from './features/users/users.routes';
import { authGuard } from './core/guards/auth.guard';
import { unauthenticatedGuard } from './core/guards/unauthenticated.guard';

// todo: convert them to standalone routes
// https://angular.io/guide/standalone-components#standalone-routes

export const routes: Routes = [
  {
    path: 'auth', // todo: use constant placed, do the same for all paths
    canActivate: [unauthenticatedGuard],
    loadComponent: () => import('./features/auth/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: USERS_PATH, // todo: use constant placed in an even better place or higher level
    canActivate: [authGuard],
    loadChildren: () => import('./features/users/users.routes').then(r => r.USERS_ROUTES),
  },
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth' }
]
