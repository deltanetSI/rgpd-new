import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';


@Component({
  selector: 'app-menubar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent {
  
  @Input() isDark: boolean = false;
  @Input() sidebarVisible: boolean = false; // Input para conocer el estado del sidebar
  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>(); // Output para alternar el sidebar

  onToggleDarkMode(): void {
    this.toggleDarkMode.emit();
  }

  // Emite el evento para alternar la visibilidad del sidebar
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
}