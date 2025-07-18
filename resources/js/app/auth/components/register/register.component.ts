import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-auth-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    FloatLabelModule,
    MessageModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registerForm!: FormGroup;

  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const passwordConfirmation = control.get('password_confirmation');

    if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {
      passwordConfirmation.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    } else if (passwordConfirmation && passwordConfirmation.hasError('passwordsMismatch') && password?.value === passwordConfirmation.value) {
      passwordConfirmation.setErrors(null);
    }

    return null;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      console.warn('Formulario de registro inválido.');
      this.error = 'Por favor, completa los campos requeridos y corrige los errores de formato.';
      return;
    }

    this.loading = true;
    this.error = null;

    const { name, email, password } = this.registerForm.value;

    this.auth.register({
      name: name ?? '',
      email: email ?? '',
      password: password ?? '',
      password_confirmation: password ?? ''
    }).subscribe({
      next: () => {
        this.loading = false;
        console.log('Registro exitoso');
        this.router.navigate(['/login']);
      },
      error: (err: { status: number; error?: { errors?: Record<string, string[]>; message?: string } }) => {
        this.loading = false;

        if (err.status === 422 && err.error && err.error.errors) {
          const laravelErrors = Object.values(err.error.errors).flat();
          this.error = laravelErrors.join('; ') || 'Error de validación al registrarse.';
        } else {
          this.error = err?.error?.message || 'Error al registrar la cuenta. Inténtalo de nuevo.';
        }
        console.error('Error en el registro:', err);
      }
    });
  }
}