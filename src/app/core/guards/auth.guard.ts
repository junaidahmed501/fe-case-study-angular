import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacadeService } from '../facades/auth-facade.service';
import {TokenStorageService} from '../services/token-storage.service';

export const authGuard: CanActivateFn = () => {
  const authFacade = inject(TokenStorageService);
  const router = inject(Router);

  // Check if the user is authenticated
  if (authFacade.getToken()) {
    return true;
  }

  // If not authenticated, redirect to auth page
  router.navigate(['/auth']);
  return false;
};
