import { Component, OnInit, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
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
export class MainLayoutComponent implements OnInit {
  sidebarVisible = true;
  isDark = false;
  isMobile = false;

  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  isBrowser = isPlatformBrowser(this.platformId);

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


    // Establecemos nombre de la página en el navegador

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        mergeMap((route: ActivatedRoute) => route.data)
      )
      .subscribe((data: { title?: string }) => {
        if (data['title']) {
          this.titleService.setTitle(data['title']);
        }
      });

  }

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