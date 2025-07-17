import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  let apiReq = req.clone({ withCredentials: true });

  const xsrfToken = getCookie('XSRF-TOKEN');

  if (xsrfToken) {
    apiReq = apiReq.clone({
      headers: apiReq.headers.set('X-XSRF-TOKEN', xsrfToken)
    });
  }

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Aquí puedes gestionar redirecciones o logout en 401/403
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
