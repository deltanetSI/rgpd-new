import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  console.log('Guard ejecutado, userLoaded:', auth.userLoaded());

  // Si el usuario ya está cargado, decide inmediatamente
  if (auth.userLoaded()) {
    if (auth.isAuthenticated()) {
      return true;
    } else {
      router.navigate(['/auth/login']);
      return false;
    }
  }

  // Si no está cargado, espera a que lo esté (polling simple)
  return new Promise<boolean>(resolve => {
    let waited = 0;
    const interval = setInterval(() => {
      if (auth.userLoaded()) {
        clearInterval(interval);
        if (auth.isAuthenticated()) {
          resolve(true);
        } else {
          router.navigate(['/auth/login']);
          resolve(false);
        }
      }
      waited += 50;
      if (waited > 5000) { // 5 segundos máximo
        clearInterval(interval);
        router.navigate(['/auth/login']);
        resolve(false);
      }
    }, 50);
  });
}; 