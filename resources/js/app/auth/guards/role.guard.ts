// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { map, catchError, of } from 'rxjs';
// import { User } from '../entities/user.entity';

// export function roleGuard(expectedRole: string): CanActivateFn {
//   return () => {
//     const auth = inject(AuthService);
//     const router = inject(Router);
//     return auth.getUser().pipe(
//       map((user: User) => {
//         if (user && user.roles && user.roles.includes(expectedRole)) {
//           return true;
//         } else {
//           router.navigate(['/forbidden']);
//           return false;
//         }
//       }),
//       catchError(() => {
//         router.navigate(['/forbidden']);
//         return of(false);
//       })
//     );
//   };
// } 