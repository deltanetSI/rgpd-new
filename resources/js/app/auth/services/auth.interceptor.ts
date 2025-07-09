import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const apiReq = req.clone({ withCredentials: true });
  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Aquí puedes gestionar redirecciones o logout en 401/403
      return throwError(() => error);
    })
  );
}; 