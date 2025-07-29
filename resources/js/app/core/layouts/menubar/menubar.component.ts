import { ChangeDetectorRef, Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../../auth/services/auth.service';
import { PopoverModule } from 'primeng/popover';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ActiveCompanyService } from '../../../companies/services/active-company-service';
import { CompanyService } from '../../../companies/services/company-service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
    AvatarModule,
    PopoverModule,
    ToggleSwitch,
    DividerModule,
    FormsModule,
    RouterLink,
    SplitButtonModule
  ],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  userInitial = '?';
  companyInitial = 'Ningun responsable seleccionado';
  isLoadingCompany = false;

  @Input() isDark = false;
  @Input() sidebarVisible = false; // Input para conocer el estado del sidebar
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>(); // Output para alternar el sidebar
  @Output() openCompanySelectionDialog = new EventEmitter<void>();

  private auth = inject(AuthService);
  private router = inject(Router);
  private activeCompanyService = inject(ActiveCompanyService);
  private companyService = inject(CompanyService);
  private cdr = inject(ChangeDetectorRef);
  private activeCompanySubscription!: Subscription;

  // Emite el evento para alternar el modo oscuro
  onToggleDarkMode(): void {
    this.toggleDarkMode.emit();
  }

  // Emite el evento para alternar la visibilidad del sidebar
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  ngOnInit(): void {

    this.activeCompanySubscription = this.activeCompanyService.activeCompanyId$.subscribe(companyId => {

      this.isLoadingCompany = true;

      if (companyId) {

        this.companyService.getCompany(companyId).subscribe({
          next: (company) => {

            this.companyInitial = company.name;

            this.isLoadingCompany = false;

            this.cdr.markForCheck();


          },
          error: (error) => {
            console.error('Error al obtener la empresa activa:', error);
          }
        });

      }



      const user = this.auth.user();

      if (user) {
        this.userInitial = user.name.charAt(0).toUpperCase();
      }

    });

  }

  logOut() {

    this.auth.logout().subscribe({
      next: () => {

        // Limpiar la empresa activa
        this.activeCompanyService.clearActiveCompany();

        this.router.navigate(['/auth/login']);

      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }


  onSplitButtonDropdownClick(): void {
    this.openCompanySelectionDialog.emit();
  }


}