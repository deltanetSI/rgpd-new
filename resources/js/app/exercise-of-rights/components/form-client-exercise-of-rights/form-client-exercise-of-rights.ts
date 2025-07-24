import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ExerciseOfRightsCreateDto } from '../../interfaces/exercise-of-rights-create-dto';
import { ExerciseOfRightsService } from '../../services/exercise-of-rights-service';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { ExerciseOfRightsResponseDto } from '../../interfaces/exercise-of-rights-response-dto';

@Component({
  selector: 'app-create-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FloatLabelModule,
    MessageModule,
    InputMaskModule,
    DividerModule,
    SelectModule,
    ToastModule,
    TextareaModule,
  ],
  templateUrl: './form-client-exercise-of-rights.html',
  styleUrls: ['./form-client-exercise-of-rights.css'],
  providers: [MessageService],
})

export class FormClientExerciseOfRights implements OnInit {

  @Input() visible = false;

  @Output() dialogHidden = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  private messageService = inject(MessageService);

  private exerciseOfRightsService = inject(ExerciseOfRightsService);


  labelDetails = 'Información';

  clientForm!: FormGroup;

  exercises = [
    { label: 'Ejercicio acceso', value: 'ejercicio-acceso' },
    { label: 'Ejercicio rectificación', value: 'ejercicio-rectificacion' },
    { label: 'Ejercicio supresión', value: 'ejercicio-supresion' },
    { label: 'Ejercicio oposición', value: 'ejercicio-oposicion' },
    { label: 'Ejercicio limitación', value: 'ejercicio-limitacion' }
  ];

  selectedExercise = 'ejercicio-rectificacion';

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      exercise: ['', Validators.required],
      last_name: ['', Validators.required],
      address: ['', Validators.required],
      details: [{ value: '', disabled: true }],
      postal_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      city: ['', Validators.required],
      province: ['', Validators.required],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]]
    });
  }

  onExerciseChange(value: string) {

    this.selectedExercise = value;

    // Cambia el label según la opción seleccionada
    if (value) {

      this.clientForm.get('details')?.enable();

      switch (value) {
        case 'ejercicio-rectificacion':
          this.labelDetails = 'Datos para rectificación';
          break;
        case 'ejercicio-supresion':
          this.labelDetails = 'Datos para supresión';
          break;
        case 'ejercicio-oposicion':
          this.labelDetails = 'Razones para oposición';
          break;
        case 'ejercicio-limitacion':
          this.labelDetails = 'Datos para limitación';
          break;
        default:
          this.clientForm.get('details')?.reset();
          this.clientForm.get('details')?.disable();
          this.labelDetails = 'Información';
      }
    } else {
      this.clientForm.get('details')?.disable();
      this.labelDetails = 'Información';
    }
  }

  saveRequest(): void {

    this.clientForm.markAllAsTouched();

    if (this.clientForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor, completa todos los campos requeridos y corrige los errores.'
      });
      return;
    }

    // Construimos datos

    const currentOrganizationId = 1;

    const formValues = this.clientForm.value;

    const dataToSend: ExerciseOfRightsCreateDto = {
      organization_id: currentOrganizationId,
      template_type: formValues.exercise,
      full_name: `${formValues.name} ${formValues.last_name}`,
      full_address: `${formValues.address}, ${formValues.postal_code}, ${formValues.city}, ${formValues.province}`,
      nif: formValues.dni,
      city: formValues.city,
      request_content: formValues.details,
    };

    console.log('Datos del cliente a enviar al backend:', dataToSend);

    this.exerciseOfRightsService.createExerciseOfRights(dataToSend).subscribe({
      next: (response: ExerciseOfRightsResponseDto) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Solicitud de ejercicio de derechos creada correctamente.'
        });

        if (response && response.download_url) {
          const link = document.createElement('a');
          link.href = response.download_url;
          link.download = `solicitud-${response.full_name}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          this.messageService.add({
            severity: 'info',
            summary: 'Descarga iniciada',
            detail: 'El documento se está descargando.'
          });
        }


        console.log('Solicitud creada con éxito:', response);
        this.onHideDialog();
      },
      error: (error) => {
        console.error('Error al generar la solicitud:', error);
        let errorMessage = 'Ha ocurrido un error al generar la solicitud.';

        if (error.status === 422 && error.error && error.error.errors) {

          errorMessage = 'Errores de validación:';
          for (const key in error.error.errors) {
            if (error.error.errors.hasOwnPropertycall(key)) {
              errorMessage += ` ${error.error.errors[key].join(', ')}`;
            }
          }

        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
      }
    });

    this.onHideDialog();
  }


  onHideDialog(): void {
    this.visible = false;
    this.clientForm.reset();
    this.dialogHidden.emit();
  }


  isInvalid(controlName: string): boolean | undefined {
    const control = this.clientForm.get(controlName);
    return control?.invalid && control?.touched;
  }
}