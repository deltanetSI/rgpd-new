import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function roleGuard(expectedRole: string): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isAuthenticated() || !auth.user()?.roles?.includes(expectedRole)) {
      router.navigate(['/forbidden']);
      return false;
    }
    return true;
  };
} 