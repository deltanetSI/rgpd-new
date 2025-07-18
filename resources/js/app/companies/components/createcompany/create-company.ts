import { Component, EventEmitter, Input, Output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Añadido ReactiveFormsModule y clases de formularios reactivos
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select'; // Confirmado que usas p-select
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { StepperModule } from 'primeng/stepper';
import { MessageModule } from 'primeng/message'; // Para p-message
import { CompanyService } from '../../services/company-service';
import { CompanyResponseDto } from '../../interfaces/company-response-dto';
import { CompanyCreateDto } from '../../interfaces/company-create-dto';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-create-company',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    InputMaskModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    ButtonModule,
    FloatLabelModule,
    StepperModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './create-company.html',
  styleUrl: './create-company.css'
})
export class Createcompany implements OnInit {

  private companyService = inject(CompanyService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  @Input() visible = false;
  @Output() dialogClosed = new EventEmitter<void>();

  activeStep = 1;
  companyForm!: FormGroup; // Declarar el FormGroup

  companyTypes = [
    { label: 'Pública', value: 'public' },
    { label: 'Privada', value: 'private' }
  ];

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      legal_name: ['', Validators.required],
      registered_address: ['', Validators.required],
      country: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      tax_id: ['', [Validators.required, Validators.pattern(/^[ABCDEFGHJKLMNPQRSUVW]{1}\d{7}[0-9A-J]{1}$/i)]],
      city: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      activity: ['', Validators.required],
      website: ['', Validators.nullValidator],
      number_of_employees: [null, [Validators.required, Validators.min(0)]],
      exercise_rights_email: ['', Validators.email],
      external_hosting: [false],
      data_sharing: [false],
      international_transfers: [false],
      mass_mailing: [false],
      user_id: [null, Validators.nullValidator],
      dpd_id: [null],
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.companyForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onHideDialog() {
    this.resetForm();
    this.activeStep = 1;
    this.dialogClosed.emit();
  }

  saveOrganization() {

    this.companyForm.markAllAsTouched();

    if (this.companyForm.invalid) {
      console.error('Formulario inválido. No se puede guardar la organización.');
      return;
    }

    // Los datos del formulario reactivo se obtienen con .value
    const companyData: CompanyCreateDto = this.companyForm.value;

    // Asigna el user_id directamente, ya que es un campo en el formulario reactivo
    companyData.user_id = 1;
    companyData.legal_name = "Prueba";

    this.companyService.createCompany(companyData).subscribe({

      next: (response: CompanyResponseDto) => {

        this.messageService.add({
          severity: 'success',
          summary: 'Información',
          detail: '¡Responsable creado correctamente!',
          key: 'successMessage'
        });

        console.log('Organización creada con éxito:', response);
        this.visible = false;
        this.resetForm();
        this.activeStep = 1;
        this.dialogClosed.emit();

      },
      error: (error) => {

         this.messageService.add({
          severity: 'danger',
          summary: 'Información',
          detail: 'Ha surgido un error al crear el responsable.',
          key: 'successMessage'
        });

        console.error('Error al crear la organización:', error);
        if (error.status === 422 && error.error && error.error.errors) {
          console.log('Errores de validación de Laravel:', error.error.errors);
        }
      }
    });
  }

  onCancel(): void {
    this.activeStep = 1;
    this.resetForm();
    console.log('Creación de organización cancelada.');
    this.dialogClosed.emit();
    this.visible = false;
  }

  resetForm() {

    this.companyForm.reset({
      type: '',
      name: '',
      legal_name: '',
      registered_address: '',
      country: '',
      postal_code: '',
      tax_id: '',
      city: '',
      address: '',
      province: '',
      phone: '',
      email: '',
      activity: '',
      website: '',
      number_of_employees: null,
      exercise_rights_email: '',
      external_hosting: false,
      data_sharing: false,
      international_transfers: false,
      mass_mailing: false,
      user_id: null,
      dpd_id: null,
    });
  }
}
