import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthFacadeService} from '../facades/auth-facade.service';
import {APP_ROUTES} from '../../shared/constants/routes.constants';

/**
 * Route guard that prevents authenticated users from accessing auth pages
 * Redirects already authenticated users to the users page
 */
export const unauthenticatedGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    router.navigate([APP_ROUTES.USERS], { replaceUrl: true });
    return false;
  }

  return true;
};
