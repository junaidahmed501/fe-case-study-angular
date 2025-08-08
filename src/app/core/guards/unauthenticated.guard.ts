import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthFacadeService} from '../facades/auth-facade.service';
import {ROUTES} from '../../shared/constants/routes.constants';

/**
 * Unauthenticated guard to protect routes that should only be accessed by non-authenticated users
 * Redirects to the users page if the user is already authenticated
 */
export const unauthenticatedGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  if (authFacade.isAuthenticated()) {
    router.navigate([ROUTES.USERS], { replaceUrl: true });
    return false;
  }

  return true;
};
