import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { roleGuard } from './auth/role.guard';
import { permissionGuard } from './auth/permission.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'articles/edit',
    canActivate: [permissionGuard('edit articles')],
    loadComponent: () => import('./articles/edit-article.component').then(m => m.EditArticleComponent),
  },
  // ...otras rutas...
];
