import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { KeyFilterModule } from 'primeng/keyfilter';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { StepperModule } from 'primeng/stepper';
import { CompanyService } from '../../services/company-service';
import { CompanyResponseDto } from '../../interfaces/company-response-dto';
import { CompanyCreateDto } from '../../interfaces/company-create-dto';

@Component({
  selector: 'app-create-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    InputMaskModule,
    InputNumberModule,
    KeyFilterModule,
    TextareaModule,
    CheckboxModule,
    ButtonModule,
    FloatLabelModule,
    StepperModule,
  ],
  templateUrl: './create-company.html',
  styleUrl: './create-company.css'
})
export class Createcompany {

  // Inyectamos servicio

  private companyService = inject(CompanyService);

  @Input() visible = false;
  @Output() dialogClosed = new EventEmitter<void>();

  activeStep = 1;

  organizationTypes = [
    { label: 'Pública', value: 'Pública' },
    { label: 'Privada', value: 'Privada' }
  ];

  organization: CompanyCreateDto = {
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
  };



  onHideDialog() {
    this.resetForm();
    this.activeStep = 1;
    this.dialogClosed.emit();
  }

  saveOrganization() {

    console.log(this.organization);

    this.organization.user_id = 1;

    this.companyService.createCompany(this.organization).subscribe({

      // Maneja la respuesta exitosa del servidor.
      next: (response: CompanyResponseDto) => {

        console.log('Organización creada con éxito:', response);

        // Opcional: Mostrar un mensaje de éxito al usuario (ej. con PrimeNG Message/Toast)

        this.visible = false;
        this.resetForm();
        this.activeStep = 1;
        this.dialogClosed.emit();

      },

      // Maneja cualquier error que ocurra durante la petición.
      error: (error) => {
        console.error('Error al crear la organización:', error);
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
    this.organization = {
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
    };
  }


}
