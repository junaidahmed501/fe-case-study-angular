import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacadeService } from '../facades/auth-facade.service';

export const unauthenticatedGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // If the user is already authenticated, redirect to users page
  if (authFacade.isAuthenticated()) {
    router.navigate(['/users'], { replaceUrl: true });
    return false;
  }

  // Allow access to auth page only for unauthenticated users
  return true;
};
