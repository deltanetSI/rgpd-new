import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Comprobamos primero el estado local síncrono del signal.
  // Esto es súper rápido y resuelve el problema de la redirección después del login.
  if (authService.isAuthenticated()) {
    return true;
  }

  // 2. Si no está autenticado localmente (ej: el usuario refrescó la página),
  // entonces recurrimos al observable que valida la sesión con el backend.
  return authService.userLoadedCheck$.pipe(
    map(user => {
      if (user) {
        return true; // La sesión es válida en el servidor, permitir paso.
      }
      
      // Si no hay usuario, la sesión no es válida, redirigir a login.
      router.navigate(['/auth/login']);
      return false;
    }),
    take(1) // Nos aseguramos de que el observable se complete después de la primera emisión.
  );
};