import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {unauthenticatedGuard} from './core/guards/unauthenticated.guard';
import {ROUTES} from './shared/constants/routes.constants';
import {LoginPageComponent} from './features/auth/login-page/login-page.component';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [unauthenticatedGuard],
    component: LoginPageComponent,
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('./features/users/users.routes').then(r => r.USERS_ROUTES),
  },
  { path: '', redirectTo: ROUTES.AUTH, pathMatch: 'full' },
  { path: '**', redirectTo: ROUTES.AUTH }
]
