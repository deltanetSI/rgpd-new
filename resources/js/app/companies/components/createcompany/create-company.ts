import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    StepperModule
  ],
  templateUrl: './create-company.html',
  styleUrl: './create-company.css'
})
export class Createcompany {

  @Input() visible = false;
  @Output() dialogClosed = new EventEmitter<void>();

  activeStep = 1;

  organizationTypes = [
    { label: 'Pública', value: 'publica' },
    { label: 'Privada', value: 'privada' }
  ];

  organization = {
    name: '',
    address: '',
    nif: '',
    phone: '',
    email: '',
    type: '',
    city: '',
    province: '',
    postalCode: '',
    activityDescription: '',
    rightsEmail: '',
    website: '',
    numEmployees: null,
    externalHosting: false,
    dataTransfers: false,
    internationalTransfers: false,
    massMailing: false
  };


  onHideDialog() {
    this.resetForm();
    this.activeStep = 1;
    this.dialogClosed.emit();
  }

  saveOrganization() {
    console.log('Organización guardada:', this.organization);
    this.visible = false;
    this.resetForm();
    this.activeStep = 1;
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
      name: '',
      address: '',
      nif: '',
      phone: '',
      email: '',
      type: '',
      city: '',
      province: '',
      postalCode: '',
      activityDescription: '',
      rightsEmail: '',
      website: '',
      numEmployees: null,
      externalHosting: false,
      dataTransfers: false,
      internationalTransfers: false,
      massMailing: false
    };
  }


}
