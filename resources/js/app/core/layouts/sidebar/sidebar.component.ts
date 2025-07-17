import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [DrawerModule, PanelMenuModule, ButtonModule, CommonModule, TooltipModule]
})
export class SidebarComponent {

  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() visible = false;
  @Input() modal = true;
  @Input() fullScreen = false;

  private authService = inject(AuthService);
  private router = inject(Router);


  menuItems: MenuItem[] = [ // Definición directa del array MenuItem[]
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/dashboard',
    },
    {
      label: 'Organización',
      icon: 'pi pi-building-columns',
      items: [
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          routerLink: '/organization/users'
        },
        {
          label: 'Responsables',
          icon: 'pi pi-user-plus',
          routerLink: '/organization/companies'
        }]
    },


  ];


  onHide() {
    this.visibleChange.emit(false);
  }


  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);

      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }


}
