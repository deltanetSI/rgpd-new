// src/app/guards/guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos el mismo observable que el AuthGuard
  return authService.userLoadedCheck$.pipe(
    map(user => {
      // Si HAY un usuario (está autenticado)...
      if (user) {
        // ...lo redirigimos al dashboard y bloqueamos el acceso al login.
        router.navigate(['/dashboard']); 
        return false;
      } else {
        // Si NO hay usuario, permitimos que vea la página de login/registro.
        return true;
      }
    })
  );
};