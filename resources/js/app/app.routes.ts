import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth.guard';
import { MainLayoutComponent } from './core/layouts/main/main-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/components/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/components/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/components/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./auth/components/verify-email.component').then(m => m.VerifyEmailComponent),
    canActivate: [authGuard]
  },
  
  {
    path: '',
    component: MainLayoutComponent, // Use the main layout for authenticated routes
    //canActivate: [authGuard], // Protect these routes with authGuard
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route after login
      { path: 'dashboard', loadComponent: () => import('./dashboard/components/dashboard/dashboard').then(m => m.DashboardComponent),
        data: { title: 'Inicio' }
      },
      { path: 'organization', loadComponent: () => import('./organizations/components/organization/organization').then(m => m.OrganizationComponent),
        data: { title: 'Gestión de organizaciones' }
      } 
    ]
  },

  
  //{ path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect root to login if not authenticated
  //{ path: '**', redirectTo: 'login' } // Redirect unmatched paths to login

];