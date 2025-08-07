import {Routes} from '@angular/router';
import {ROUTES} from '../../shared/constants/routes.constants';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./users-list-page/users-list-page.component').then(c => c.UsersListPageComponent)
  },
  {
    path: ROUTES.CREATE,
    loadComponent: () => import('./user-form-page/user-form-page.component').then(c => c.UserFormPageComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./user-form-page/user-form-page.component').then(c => c.UserFormPageComponent)
  }
]
