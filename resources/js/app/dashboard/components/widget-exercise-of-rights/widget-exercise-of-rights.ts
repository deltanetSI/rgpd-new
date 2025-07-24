import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { FormClientExerciseOfRights } from '../../../exercise-of-rights/components/form-client-exercise-of-rights/form-client-exercise-of-rights';
import { ExerciseOfRightsService } from '../../../exercise-of-rights/services/exercise-of-rights-service';
import { ExerciseOfRightsResponseDto } from '../../../exercise-of-rights/interfaces/exercise-of-rights-response-dto';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-exercise-of-rights',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    FileUploadModule,
    DividerModule,
    TooltipModule,
    MessageModule,
    ToastModule,
    FormClientExerciseOfRights,
    SelectModule,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './widget-exercise-of-rights.html',
  styleUrl: './widget-exercise-of-rights.css',
  host: {
    'class': '!w-full block'
  }
})
export class WidgetExerciseOfRights implements OnInit {

  private exerciseOfRightsService = inject(ExerciseOfRightsService);

  private cdr = inject(ChangeDetectorRef);

  availableRequests: ExerciseOfRightsResponseDto[] = []; 
  selectedRequest: ExerciseOfRightsResponseDto | null = null;
  isLoadingRequests = true;

   ngOnInit(): void {
    this.loadExerciseOfRightsRequests();
  }

  loadExerciseOfRightsRequests(): void {

    this.isLoadingRequests = true;

    this.exerciseOfRightsService.getAllExerciseOfRightsRequests().subscribe({

    next: (data: ExerciseOfRightsResponseDto[]) => {
        this.availableRequests = data;
        this.isLoadingRequests = false;
        this.cdr.markForCheck();
        console.log('Solicitudes de derechos cargadas:', this.availableRequests);
      },

      error: (err: HttpErrorResponse) => { // Tipar 'err' como HttpErrorResponse
        console.error('Error al cargar las solicitudes de derechos:', err);
        if (err.error instanceof ErrorEvent) {
          // Error del lado del cliente o de red
          console.error('Error del lado del cliente o de red:', err.error.message);
        } else {
          // Error del lado del servidor
          console.error(`Backend devolvió el código ${err.status}, el cuerpo fue:`, err.error);
          // Si el cuerpo del error es un objeto JSON, puedes loguearlo directamente
          if (typeof err.error === 'object' && err.error !== null) {
            console.error('Detalles del error del backend:', err.error);
          }
        }
        this.isLoadingRequests = false;
    }
  });
  }

  createClientDialog = false;

  onShowCreateClientDialog() {
    this.createClientDialog = true;
  }

  onHideCreateClientDialog() {
    this.createClientDialog = false;
    this.loadExerciseOfRightsRequests();
  }

}
