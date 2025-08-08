import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {AuthFacadeService} from '../facades/auth-facade.service';
import {API} from '../../shared/constants/api.constants';

/**
 * Intercepts HTTP requests to add auth token and handle authentication errors
 * Skips token for login requests and adds Bearer token to all others
 * Handles 401 errors by logging out the user
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // Skip adding the token for authentication endpoints
  if (req.url.includes(API.AUTH_LOGIN)) {
    return next(req);
  }

  const token = authFacade.getToken();

  // If we have a token, clone and add it to the request
  if (token) {
    req = addTokenToRequest(req, token);
  }

  // Process the request and handle errors
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authFacade.logout();
        router.navigate(['/auth']);
      }
      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};

/**
 * Adds authentication token to request headers
 * Clones the request to maintain immutability
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

