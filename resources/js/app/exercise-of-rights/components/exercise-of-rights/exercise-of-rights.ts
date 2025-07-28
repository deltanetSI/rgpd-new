import { ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table'; 
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Datatable, ColumnConfig, ColumnBodyContext } from '../../../shared/components/datatable/datatable';
import { ExerciseOfRightsService } from '../../services/exercise-of-rights-service';
import { FormClientExerciseOfRights } from '../form-client-exercise-of-rights/form-client-exercise-of-rights';
import { ExerciseOfRightsResponseDto } from '../../interfaces/exercise-of-rights-response-dto';


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
export class ExerciseOfRights implements OnInit, AfterViewInit {

  // Enlazar botones de descarga
  @ViewChild('actionBodyTemplate') actionBodyTemplate!: TemplateRef<ColumnBodyContext<ExerciseOfRightsResponseDto>>;
  @ViewChild('organizationNameTemplate') organizationNameTemplate!: TemplateRef<ColumnBodyContext<ExerciseOfRightsResponseDto>>;

  // Estado cargando
  loadingRequests = true;

  // Array de requests bindeado al dto
  requests: ExerciseOfRightsResponseDto[] = [];

  // Nos sirve para indicar cuando angular detecta cambios
  private cdr = inject(ChangeDetectorRef);

  // Inyeccion de dependencias para el srvice
  private exerciseOfRightsService = inject(ExerciseOfRightsService);

  cols: ColumnConfig<ExerciseOfRightsResponseDto>[] = [
    {
      header: '',
      field: 'downloadField',
      filter: false,
      minWidth: '40px'
    },
    { field: 'template_type', header: 'Tipo de ejercicio', filter: true, minWidth: '180px' },
    {
      field: 'organization.name',
      header: 'Organización',
      filter: true,
      minWidth: '220px'
    },
    { field: 'full_name', header: 'Nombre Completo', filter: true, minWidth: '200px' },
    { field: 'full_address', header: 'Dirección Completa', filter: true, minWidth: '250px' },
    { field: 'nif', header: 'NIF', filter: true },
    { field: 'city', header: 'Ciudad', minWidth: '120px' },
    { field: 'date', header: 'Fecha' },
  ];

  downloadFile(url: string, fileName: string): void {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  ngAfterViewInit(): void {
    const actionCol = this.cols.find(col => col.field === 'downloadField');
    if (actionCol) {
      actionCol.bodyTemplate = this.actionBodyTemplate;
    }

    const orgCol = this.cols.find(col => col.field === 'organization.name');
    if (orgCol) {
      orgCol.bodyTemplate = this.organizationNameTemplate;
    }

    this.cdr.detectChanges();
  }


  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.loadingRequests = true;
    this.exerciseOfRightsService.getAllExerciseOfRightsRequests().subscribe({
      next: (data: ExerciseOfRightsResponseDto[]) => {
        this.requests = data;
        this.cdr.markForCheck();
        console.log('Solicitudes cargadas desde la API:', this.requests);
        this.loadingRequests = false;
      },
      error: (err) => {
        console.error('Error al cargar las solicitudes:', err);
      }
    });
  }


  globalFilterFields = ['id', 'organization_id', 'template_type', 'full_name', 'full_address', 'nif', 'download_url', 'city', 'date', 'filepath'];


  createClientDialog = false;

  onShowCreateClientDialog() {
    this.createClientDialog = true;
  }

  onHideCreateClientDialog() {
    this.createClientDialog = false;
    this.loadRequests();
  }


}
