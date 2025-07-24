import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table'; // Importamos Table y TableModule
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Datatable } from '../../../shared/components/datatable/datatable';
import { ExerciseOfRightsResponseDto } from '../../interfaces/exercise-of-rights-response-dto';
import { ExerciseOfRightsService } from '../../services/exercise-of-rights-service';
import { FormClientExerciseOfRights } from '../form-client-exercise-of-rights/form-client-exercise-of-rights';

@Component({
  selector: 'app-exercise-of-rights',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    Datatable,
    FormClientExerciseOfRights,
  ],
  templateUrl: './exercise-of-rights.html',
  styleUrl: './exercise-of-rights.css'
})
export class ExerciseOfRights implements OnInit {

  loadingRequests = true;

  showDialogFlag = false;

  requests: ExerciseOfRightsResponseDto[] = [];

  private cdr = inject(ChangeDetectorRef);

  private exerciseOfRightsService = inject(ExerciseOfRightsService);

   cols = [
    //{ field: 'organization_id', header: 'ID de la Organización', filter: true },
    { field: 'template_type', header: 'Tipo de ejercicio', filter: true, minWidth: '180px' },
    { field: 'full_name', header: 'Nombre Completo', filter: true, minWidth: '200px' },
    { field: 'full_address', header: 'Dirección Completa', filter: true, minWidth: '250px' },
    { field: 'nif', header: 'NIF', filter: true },
    { field: 'city', header: 'Ciudad' },
    { field: 'date', header: 'Fecha' },
  ];

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.exerciseOfRightsService.getAllExerciseOfRightsRequests().subscribe({
      next: (data: ExerciseOfRightsResponseDto[]) => {
        this.requests = data;
        console.log('Solicitudes cargadas desde la API:', this.requests);
        this.loadingRequests = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las solicitudes:', err);
        this.loadingRequests = false;
      }
    });
  }

 
  globalFilterFields = ['id', 'organization_id', 'template_type', 'full_name', 'full_address', 'nif', 'download_url', 'city', 'date', 'filepath'];
  


  handleDialogClose() {
    this.showDialogFlag = false;
  }

}
