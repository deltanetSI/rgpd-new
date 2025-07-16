import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenu } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [DrawerModule, PanelMenu, ButtonModule, CommonModule]
})
export class SidebarComponent {

  @Input() visible = false;
  @Input() modal = true;
  @Input() fullScreen = false;


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


}
