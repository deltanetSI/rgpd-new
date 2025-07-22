import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Asegúrate de que la ruta sea correcta
import { isPlatformBrowser } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);
  const xsrfToken = getCookie('XSRF-TOKEN');

  const apiReq = req.clone({
    withCredentials: true,
    headers: xsrfToken
      ? req.headers
          .set('X-XSRF-TOKEN', xsrfToken)
          .set('Accept', 'application/json')
          .set('X-Requested-With', 'XMLHttpRequest')
      : req.headers
          .set('Accept', 'application/json')
          .set('X-Requested-With', 'XMLHttpRequest')
  });

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // ¡LA CLAVE ESTÁ AQUÍ!
      // Solo intentamos redirigir si estamos en un navegador.
      if (isPlatformBrowser(platformId)) {
        if ((error.status === 401 || error.status === 419) && !req.url.includes('/logout')) {
          authService.handleAuthError();
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};


function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    // Estamos en SSR o en un entorno sin DOM
    return null;
  }
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const c = cookie.trimStart();
    if (c.startsWith(nameEQ)) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
}