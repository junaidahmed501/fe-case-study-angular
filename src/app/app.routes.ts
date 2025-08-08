import {Routes} from '@angular/router';
import {authGuard} from './core/guards/auth.guard';
import {unauthenticatedGuard} from './core/guards/unauthenticated.guard';
import {APP_ROUTES} from './shared/constants/routes.constants';
import {LoginPageComponent} from './features/auth/pages/login-page/login-page.component';

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
  { path: '', redirectTo: APP_ROUTES.AUTH, pathMatch: 'full' },
  { path: '**', redirectTo: APP_ROUTES.AUTH }
]
