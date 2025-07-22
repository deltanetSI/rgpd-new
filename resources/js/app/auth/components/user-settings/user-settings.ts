import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl } from '@angular/forms'; // <-- ¡Importa esto!
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { TabsModule } from 'primeng/tabs';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth.service';
import { User } from '../../entities/user.entity';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-settings',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    CardModule,
    PanelModule,
    DividerModule,
    MessageModule,
    TabsModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ToastModule,
    PasswordModule,
  ],
  providers: [MessageService],
  templateUrl: './user-settings.html',
  styleUrl: './user-settings.css'

})
export class UserSettings implements OnInit {


  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService); // Para notificaciones
  private cdr = inject(ChangeDetectorRef);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  currentUser: User | null = null;
  isProfileSaving = false; // Para deshabilitar el botón mientras se guarda el perfil
  isPasswordSaving = false;


  ngOnInit(): void {

    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      current_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]], // Contraseña nueva
      password_confirmation: ['', Validators.required] // Repetir contraseña nueva
    },
      {
        validators: this.passwordMatchValidator
      });

    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email
        });
      }
    });
  }


  passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl) => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('password_confirmation')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };


  onProfileSubmit(): void {


    this.profileForm.markAllAsTouched();

    if (this.profileForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, corrige los errores en el formulario de perfil.' });
      return;
    }

    this.isProfileSaving = true; // Activar estado de guardado

    const { name, email } = this.profileForm.value;

    this.authService.updateProfile({ name, email }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Perfil actualizado correctamente.' });

        this.isProfileSaving = false;
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Error al actualizar el perfil:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al actualizar el perfil.' });
        this.isProfileSaving = false;
        this.cdr.markForCheck();

      }
    });
  }



  onPasswordSubmit(): void {
    this.passwordForm.markAllAsTouched();

    if (this.passwordForm.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, corrige los errores en el formulario de contraseña.' });
      return;
    }

    this.isPasswordSaving = true;

    const { current_password, password, password_confirmation } = this.passwordForm.value;

    this.authService.updatePassword({
      current_password,
      password,
      password_confirmation
    }).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Contraseña actualizada correctamente.' });
        this.passwordForm.reset();

        this.isPasswordSaving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al actualizar la contraseña:', err);
        let errorMessage = 'Error al actualizar la contraseña.';
        if (err.status === 422 && err.error?.errors?.current_password) {
          errorMessage = 'La contraseña actual es incorrecta.';
        } else if (err.error?.message) {
          errorMessage = err.error.message;
        }

        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });

        this.isPasswordSaving = false;
        this.cdr.markForCheck();
      }
    });
  }



}
