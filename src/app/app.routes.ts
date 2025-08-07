import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {unauthenticatedGuard} from './core/guards/unauthenticated.guard';
import {ROUTES} from './shared/constants/routes.constants';

export const routes: Routes = [
  {
    path: ROUTES.AUTH,
    canActivate: [unauthenticatedGuard],
    loadComponent: () => import('./features/auth/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: ROUTES.USERS,
    canActivate: [authGuard],
    loadChildren: () => import('./features/users/users.routes').then(r => r.USERS_ROUTES),
  },
  { path: '', redirectTo: `/${ROUTES.AUTH}`, pathMatch: 'full' },
  { path: '**', redirectTo: `/${ROUTES.AUTH}` }
]
