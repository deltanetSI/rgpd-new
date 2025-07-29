import { ChangeDetectorRef, Component, EventEmitter, Input, Output, inject, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { StepperModule } from 'primeng/stepper';
import { MessageModule } from 'primeng/message';
import { CompanyService } from '../../services/company-service';
import { CompanyResponseDto } from '../../interfaces/company-response-dto';
import { CompanyCreateDto } from '../../interfaces/company-create-dto';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

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
    PanelModule,
    ConfirmDialogModule
  ],
  templateUrl: './create-company.html',
  styleUrl: './create-company.css',
})
export class Createcompany implements OnChanges, OnInit {

  private companyService = inject(CompanyService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  private confirmationService = inject(ConfirmationService);


  // Controlar visibilidad desde padre
  @Input() visible = false;

  // Avisar al padre de que se ha cerrado o no
  @Output() dialogClosed = new EventEmitter<void>();

  // Lo hacemos editable también si recibe esta prop
  @Input() companyToEdit: CompanyResponseDto | null = null;

  // para no actualziar cada vez que salimos del form 
  @Output() companySaved = new EventEmitter<CompanyResponseDto>();

  // Para el stepper de primeng
  activeStep = 1;

  // Formulario reactivo
  companyForm!: FormGroup;

  // Controlar si se está creando una nueva empresa
  creatingCompany = false;

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

  // Si hay prop empresa, rellenamos datos, si cerramos form, reseteamos form
  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes['companyToEdit'] && this.companyToEdit) {
      this.companyForm.patchValue(this.companyToEdit);
      this.activeStep = 1;

    } else if (changes['visible'] && !this.visible && !this.companyToEdit) {
      if (this.companyForm) {
        this.resetForm();
      }
      this.activeStep = 1;
    }
  }

  onHideDialog() {
    this.activeStep = 1;
    this.visible = false;
    this.resetForm();
    this.dialogClosed.emit();
    this.companyToEdit = null;
    this.cdr.markForCheck();
  }

  saveOrganization() {

    this.creatingCompany = true;

    this.companyForm.markAllAsTouched();

    if (this.companyForm.invalid) {
      console.error('Formulario inválido. No se puede guardar la organización.');
      return;
    }

    // Los datos del formulario reactivo se obtienen con .value
    const companyData: CompanyCreateDto = this.companyForm.value;

    // Asigna el user_id directamente, ya que es un campo en el formulario reactivo
    companyData.user_id = 1;

    // Si viene prop de empresa (lo cual tiene ID)
    if (this.companyToEdit && this.companyToEdit.id) {
      this.creatingCompany = true;
      this.companyService.updateCompany(this.companyToEdit.id, companyData).subscribe({
        next: (response: CompanyResponseDto) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Información',
            detail: '¡Organización actualizada correctamente!',
            key: 'successMessage'
          });
          console.log('Organización actualizada con éxito:', response);
          this.creatingCompany = false;
          this.companySaved.emit(response);
          this.onHideDialog();
        },
        error: (error) => {
          this.creatingCompany = false;
          this.messageService.add({
            severity: 'danger',
            summary: 'Información',
            detail: 'Ha surgido un error al actualizar la organización.',
            key: 'successMessage'
          });

          console.error('Error al actualizar la organización:', error);
          if (error.status === 422 && error.error && error.error.errors) {
            console.log('Errores de validación de Laravel:', error.error.errors);
          }

        }
      });
    } else {
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
          this.creatingCompany = false;
          this.resetForm();
          this.companySaved.emit(response);
          this.dialogClosed.emit();

        },
        error: (error) => {

          this.creatingCompany = false;

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

    this.companyForm.markAsPristine();
    this.companyForm.markAsUntouched();

  }


  confirmDeleteCompany(): void {

    this.confirmationService.confirm({
      message: '¿Estás seguro que deseas eliminar el responsable <b>' + this.companyToEdit?.name + '</b>?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Aceptar',
        severity: 'danger',
      },
      accept: () => {

        if (this.companyToEdit?.id != null)


          this.companyService.removeCompany(this.companyToEdit.id).subscribe({


            next: () => {

              this.messageService.add({
                severity: 'success',
                summary: 'Información',
                detail: '¡Responsable eliminado correctamente!',
                key: 'successMessage'
              });

              this.visible = false;
              this.resetForm();
              this.companySaved.emit();
              this.dialogClosed.emit();

            },
            error: (error) => {

              this.messageService.add({
                severity: 'danger',
                summary: 'Información',
                detail: 'Ha surgido un error al eliminar el responsable.',
                key: 'successMessage'
              });

              console.error('Error al crear la organización:', error);
              if (error.status === 422 && error.error && error.error.errors) {
                console.log('Errores de validación de Laravel:', error.error.errors);
              }
            }
          });


      }
    });
  }


}
