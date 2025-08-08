import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthFacadeService} from '../facades/auth-facade.service';
import {ROUTES} from '../../shared/constants/routes.constants';

/**
 * Auth guard to protect routes that require authentication
 * Redirects to the auth page if the user is not authenticated
 */
export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // Check if the user is authenticated
  if (authFacade.isAuthenticated()) {
    return true;
  }

  // If not authenticated, redirect to auth page
  router.navigate([ROUTES.AUTH], { replaceUrl: true });
  return false;
};
