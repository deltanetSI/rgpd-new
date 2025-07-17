import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layouts/main/main-layout.component';
import { AuthLayout } from './auth/layouts/auth-layout';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayout, // layout de rutas de autenticacion
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            {
                path: 'login',
                loadComponent: () =>
                    import('./auth/components/login.component').then(
                        (m) => m.LoginComponent
                    ),
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./auth/components/register.component').then(
                        (m) => m.RegisterComponent
                    ),
            },
            {
                path: 'forgot-password',
                loadComponent: () =>
                    import('./auth/components/forgot-password.component').then(
                        (m) => m.ForgotPasswordComponent
                    ),
            },
            {
                path: 'reset-password',
                loadComponent: () =>
                    import('./auth/components/reset-password.component').then(
                        (m) => m.ResetPasswordComponent
                    ),
            },
            {
                path: 'verify-email',
                loadComponent: () =>
                    import('./auth/components/verify-email.component').then(
                        (m) => m.VerifyEmailComponent
                    ),
                
            },
            { path: '**', redirectTo: 'login' }
        ],
    },
  {
    path: '',
    component: MainLayoutComponent, // Use the main layout for authenticated routes
    canActivate: [authGuard], // Protect these routes with authGuard
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route after login
      { path: 'dashboard', loadComponent: () => import('./dashboard/components/dashboard/dashboard').then(m => m.DashboardComponent),
        data: { title: 'Inicio' }
      },
      { path: 'organization/companies', loadComponent: () => import('./companies/components/companies/companies').then(m => m.OrganizationComponent),
        data: { title: 'Responsables' }
      } ,
      { path: 'organization/users', loadComponent: () => import('./users/components/users/users').then(m => m.Users),
        data: { title: 'Usuarios' }
      } ,
      { path: '**', redirectTo: 'dashboard' }
    ]
  },


];



