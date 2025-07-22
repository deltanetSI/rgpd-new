import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperamos a que la comprobación de estado de autenticación inicial haya terminado.
  return authService.isAuthStatusChecked$.pipe(
    // 1. Filtramos hasta que el estado sea `true` (la comprobación ha finalizado).
    filter(isChecked => isChecked),
    // 2. Solo necesitamos el primer evento `true`.
    take(1),
    // 3. Una vez que la comprobación ha terminado, miramos el estado síncrono.
    map(() => {
      if (authService.isAuthenticated()) {
        return true; // Si está autenticado, permitir el paso.
      }
      
      // Si no, redirigir a la página de login.
      router.navigate(['/auth/login']);
      return false;
    })
  );
};