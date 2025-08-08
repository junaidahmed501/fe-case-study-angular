import {HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError} from 'rxjs';
import {AuthFacadeService} from '../facades/auth-facade.service';
import {AUTH_API} from '../../shared/constants/api';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Auth Interceptor - adds auth token to requests and handles 401 errors
 * @param req The outgoing request
 * @param next The next handler in the chain
 * @returns The processed request observable
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);

  // Skip adding the token for authentication endpoints
  if (req.url.includes(AUTH_API.LOGIN)) {
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
        // Try to refresh token or redirect to login
        return handleUnauthorizedError(req, next, authFacade, router);
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};

/**
 * Adds the auth token to the request headers
 * @param req Original request
 * @param token Authentication token
 * @returns Cloned request with auth header
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Handles 401 Unauthorized errors by attempting to refresh token
 * @param req Original request that failed
 * @param next Next handler to retry the request
 * @param authFacade Auth facade service
 * @param router Router for navigation
 * @returns Observable of the retried request or error
 */
function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authFacade: AuthFacadeService,
  router: Router
): Observable<any> {
  // This prevents multiple parallel auth failures from all trying to refresh
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    //   }),
    //   catchError(err => {
    //     isRefreshing = false;
    //     authFacade.logout();
    //     router.navigate(['/auth']);
    //     return throwError(() => err);
    //   })
    // );

    // Since we don't have refresh tokens in this example,
    // just logout and redirect to login page
    isRefreshing = false;
    authFacade.logout();
    router.navigate(['/auth']);
    return throwError(() => new Error('Session expired. Please log in again.'));
  } else {
    // Wait for the token to be refreshed
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addTokenToRequest(req, token as string));
      })
    );
  }
}
