import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message'; 

@Component({
  selector: 'app-auth-forgot-password',
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
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit { 

  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router); 

  forgotPasswordForm!: FormGroup;

  loading = false;
  error: string | null = null;
  success = false;

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

 
  isInvalid(controlName: string): boolean {
    const control = this.forgotPasswordForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  onSubmit(): void {

    this.forgotPasswordForm.markAllAsTouched();

    if (this.forgotPasswordForm.invalid) {
      console.warn('Formulario de recuperación de contraseña inválido.');
      this.error = 'Por favor, introduce un correo electrónico válido.';
      this.success = false; 
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    const { email } = this.forgotPasswordForm.value;

    this.auth.forgotPassword({ email: email ?? '' }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true; 
        this.error = null; 
        this.forgotPasswordForm.reset(); 
      },

      error: (err: { status: number; error?: { errors?: Record<string, string[]>; message?: string } }) => {
        this.loading = false;
        this.success = false; // Asegurarse de que el mensaje de éxito no se muestre
        if (err.status === 422 && err.error && err.error.errors) {
          const laravelErrors = Object.values(err.error.errors).flat();
          this.error = laravelErrors.join('; ') || 'Error de validación al enviar el correo.';
        } else {
          this.error = err?.error?.message || 'Error al enviar el correo. Inténtalo de nuevo.';
        }
        console.error('Error al enviar el correo de recuperación:', err);
      }
    });
  }
}