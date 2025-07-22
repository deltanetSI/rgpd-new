import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';


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
    {
      label: 'Documentacion',
      icon: 'pi pi-folder',
      items: [
        {
          label: 'AEPD',
          icon: 'pi pi-book',
          routerLink: '/documentation/aepd'
        },
        {
          label: 'LEGAL',
          icon: 'pi pi-book',
          routerLink: '/documentation/legal'
        }]
    },


  ];


  onHide() {
    this.visibleChange.emit(false);
  }



}
