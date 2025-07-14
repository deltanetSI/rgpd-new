// main-layout.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarModule,
    ButtonModule,
    SidebarModule,
    PanelMenuModule,
    TooltipModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = true;
  isDark: boolean = false;
  isMobile: boolean = false;
  sideMenuItems: MenuItem[] = [];

  // Indica si el icono del navbar debe estar visible.
  // Lo usaremos para aplicar una clase CSS de fade-out.
  isNavbarLogoVisible: boolean = true;


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    this.checkMobileStatus();
    // Reajusta la visibilidad del sidebar y del icono del navbar al redimensionar.
    this.sidebarVisible = !this.isMobile;
    this.updateNavbarLogoVisibility();
  }

  ngOnInit() {
    this.checkMobileStatus();

    this.sideMenuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Gestión',
        icon: 'pi pi-cog',
        items: [
          { label: 'Usuarios', icon: 'pi pi-users', routerLink: '/users' },
          { label: 'Roles', icon: 'pi pi-lock', routerLink: '/roles' }
        ]
      },
      {
        label: 'Reportes',
        icon: 'pi pi-chart-bar',
        items: [
          { label: 'Ventas', icon: 'pi pi-dollar', routerLink: '/sales-report' },
          { label: 'Actividad', icon: 'pi pi-chart-line', routerLink: '/activity-report' }
        ]
      },
      {
        label: 'Ayuda',
        icon: 'pi pi-question-circle',
        routerLink: '/help'
      }
    ];

    // Inicializa el sidebar: visible en PC, oculto en móvil.
    this.sidebarVisible = !this.isMobile;
    this.updateNavbarLogoVisibility();
  }

  ngOnDestroy(): void {}

  checkMobileStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 768;
    }
  }

  // Alterna la visibilidad del sidebar y actualiza la visibilidad del icono del navbar.
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    this.updateNavbarLogoVisibility();
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('app-dark', this.isDark);
    }
  }

  // Controla cuándo el icono del navbar debe desvanecerse.
  updateNavbarLogoVisibility(): void {
    // El icono solo se desvanece si estamos en escritorio Y el sidebar está visible.
    // Si es móvil, o si el sidebar no está visible, el icono se mantiene visible.
    this.isNavbarLogoVisible = this.isMobile || !this.sidebarVisible;
  }
}