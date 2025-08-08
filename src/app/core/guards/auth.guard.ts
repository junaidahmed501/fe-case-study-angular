import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthFacadeService} from '../facades/auth-facade.service';
import {ROUTES} from '../../shared/constants/routes.constants';

/**
 * Route guard that protects routes requiring authentication
 * Uses reactive authentication state to determine access
 * Redirects unauthenticated users to the auth page
 */
export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    return true;
  }

  router.navigate([ROUTES.AUTH], { replaceUrl: true });
  return false;
};
