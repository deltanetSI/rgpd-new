import { Component, Input, Output, EventEmitter, inject, OnInit } from '@angular/core';
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
  ],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  userInitial = '?';


  @Input() isDark = false;
  @Input() sidebarVisible = false; // Input para conocer el estado del sidebar
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>(); // Output para alternar el sidebar

  private auth = inject(AuthService);
  private router = inject(Router);

  onToggleDarkMode(): void {
    this.toggleDarkMode.emit();
  }

  // Emite el evento para alternar la visibilidad del sidebar
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  ngOnInit(): void {

    const user = this.auth.user();

    if (user) {
      this.userInitial = user.name.charAt(0).toUpperCase();
    }

  }

  logOut() {

    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);

      },
      error: (error) => {
        console.error('Error al cerrar sesión:', error);
      }
    });
  }


}