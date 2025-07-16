import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Asegúrate de importar isPlatformBrowser
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { MenubarComponent } from '../menubar/menubar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    RippleModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  sidebarVisible: boolean = true;
  isDark: boolean = false;
  isMobile: boolean = false;

  // Inyecta PLATFORM_ID en el constructor
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @HostListener('window:resize')
  onWindowResize(): void {
    // Protección para el entorno del navegador
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileStatus();
      this.sidebarVisible = !this.isMobile;
    }
  }

  ngOnInit() {
    // TODO ESTO SOLO DEBE EJECUTARSE EN EL NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileStatus();
      this.loadDarkModeStatus();
      // Inicializa el sidebar: visible en PC, oculto en móvil.
      this.sidebarVisible = !this.isMobile;
    }
  }

  ngOnDestroy(): void { }

  // checkMobileStatus ya no necesita el "if" interno si todas sus llamadas están protegidas
  checkMobileStatus(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  toggleDarkMode(): void {
    // Protección para el entorno del navegador
    if (isPlatformBrowser(this.platformId)) {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle('app-dark', this.isDark);
      localStorage.setItem('darkModeEnabled', this.isDark.toString());
    }
  }

  loadDarkModeStatus(): void {
    // Protección para el entorno del navegador
    if (isPlatformBrowser(this.platformId)) {
      const savedMode = localStorage.getItem('darkModeEnabled');
      this.isDark = (savedMode === 'true');
      document.documentElement.classList.toggle('app-dark', this.isDark);
    }
  }
}