import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenu } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { SettingsPanelComponent } from '../../features/settings-panel/settings-panel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [DrawerModule, PanelMenu, ButtonModule, SettingsPanelComponent, CommonModule]
})
export class SidebarComponent {
  @Input() visible: boolean = false;
  @Input() modal: boolean = true;
  @Input() fullScreen: boolean = false;


    menuItems: MenuItem[] = [ // Definición directa del array MenuItem[]
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Organización',
      icon: 'pi pi-building-columns',
      routerLink: '/organization'
    },
    

  ];

  @Output() visibleChange = new EventEmitter<boolean>();

  onHide() {
    this.visibleChange.emit(false);
  }


  // Panel de control

 // Esta propiedad ahora controla la VISIBILIDAD DEL PANEL DE AJUSTES (no el diálogo directamente)
  displaySettingsPanel: boolean = false;

 // Este método ahora simplemente indica que el panel de ajustes debe ser visible
  openSettingsPanel(): void {
    this.displaySettingsPanel = true;
  }

  // Método para manejar cuando el SettingsPanelComponent se cierra (desde dentro)
  handleSettingsPanelClose(): void {
    this.displaySettingsPanel = false;
  }

}
