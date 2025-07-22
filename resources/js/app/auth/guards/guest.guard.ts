import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter, take } from 'rxjs/operators';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Esperamos a que la comprobación de estado de autenticación inicial haya terminado.
  return authService.isAuthStatusChecked$.pipe(
    // 1. Filtramos hasta que el estado sea `true`.
    filter(isChecked => isChecked),
    // 2. Tomamos solo el primer valor `true`.
    take(1),
    // 3. Una vez que la comprobación ha terminado, decidimos.
    map(() => {
      // Si el usuario SÍ está autenticado...
      if (authService.isAuthenticated()) {
        // ...lo redirigimos al dashboard y bloqueamos el acceso.
        router.navigate(['/dashboard']);
        return false;
      } else {
        // Si NO está autenticado, permitimos que vea la página de login/registro.
        return true;
      }
    })
  );
};