import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MenubarComponent } from '../menubar/menubar.component';
import { Selectcompany } from '../../../companies/components/selectcompany/selectcompany';
import { Createcompany } from '../../../companies/components/createcompany/create-company';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CompanyResponseDto } from '../../../companies/interfaces/company-response-dto';
import { ActiveCompanyService } from '../../../companies/services/active-company-service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    MenubarComponent,
    RippleModule,
    Selectcompany,
    Createcompany,
    ToastModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {


  sidebarVisible = false;
  isDark = false;
  isMobile = false;

  showCompanySelectionDialog = false;
  showCreateCompanyDialog = false;
  companyWasJustCreated = false;

  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  private messageService = inject(MessageService);
  private activeCompanyService = inject(ActiveCompanyService);

  


  ngOnInit() {

    // TODO ESTO SOLO DEBE EJECUTARSE EN EL NAVEGADOR
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobileStatus();
      this.loadDarkModeStatus();

      if (!this.activeCompanyService.getCurrentActiveCompanyId()) {
        // Si no hay empresa activa, mostramos el diálogo de selección
        this.showCompanySelectionDialog = true;
      }
    }
  }

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



  // Seleccion empresa

  onCompanySelectedFromDialog(company: CompanyResponseDto): void {
    this.activeCompanyService.setActiveCompany(company);
    this.showCompanySelectionDialog = false;
    this.messageService.add({
      severity: 'success',
      key: 'selectcompany',
      summary: 'Responsable seleccionado',
      detail: `Ahora está trabajando con ${company.name}`,
      life: 6000
    });
  }


  onCreateCompanyFromDialog(): void {
    this.showCompanySelectionDialog = false;
    this.showCreateCompanyDialog = true;
  }

  onHideCreateCompanyDialog(): void {

    if (!this.companyWasJustCreated) {

      this.showCreateCompanyDialog = false;
      this.showCompanySelectionDialog = true;

    }

  }

  onCompanyCreated(company: CompanyResponseDto): void {

    this.companyWasJustCreated = true;

    this.activeCompanyService.setActiveCompany(company);
    this.showCreateCompanyDialog = false;
    this.showCompanySelectionDialog = false;
    this.messageService.add({
      severity: 'success',
      key: 'selectcompany',
      summary: 'Responsable seleccionado',
      detail: `Se ha creado y seleccionado ${company.name}.`,
      life: 6000
    });
  }

  onOpenCompanySelectionDialogFromMenubar(): void { 
    this.showCompanySelectionDialog = true;
  }

}