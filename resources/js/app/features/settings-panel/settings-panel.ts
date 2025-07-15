import { Component, EventEmitter, Input, Output } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'; 

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule // Añadir DialogModule a los imports
  ],
  templateUrl: './settings-panel.html',
  styleUrls: ['./settings-panel.css']
})
export class SettingsPanelComponent {

  @Input() displayPanel: boolean = false; // Propiedad para que SidebarComponent la controle
  @Output() displayPanelChange = new EventEmitter<boolean>(); // Para la vinculación bidireccional de 'visible' del dialog
  @Output() dialogClosed = new EventEmitter<void>(); // Emitir cuando el diálogo se cierra (por Escape, clic fuera, o botón cerrar)

  // Métodos de acción y cierre del diálogo
  onCreateCompany(): void {
    // Lógica para crear empresa
    this.closePanel();
  }

  onManageUsers(): void {
    // Lógica para gestionar usuarios
    this.closePanel();
  }

  onGeneralSettings(): void {
    // Lógica para configuración general
    this.closePanel();
  }

  // Método para cerrar el panel (diálogo)
  closePanel(): void {
    this.displayPanel = false;
    this.displayPanelChange.emit(false); // Notifica al componente padre
    this.dialogClosed.emit(); // Notifica que el diálogo se ha cerrado
  }
}