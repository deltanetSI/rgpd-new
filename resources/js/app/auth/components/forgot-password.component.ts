import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthLayout } from '../layouts/auth-layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-forgot-password',
  standalone: true,
  imports: [AuthLayout, ReactiveFormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-layout>
      <div auth-header>
        <h2 class="text-2xl font-bold text-center mb-2">Recuperar contraseña</h2>
        <p class="text-center text-gray-500 mb-4">Introduce tu correo para recibir instrucciones</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <input pInputText formControlName="email" type="email" placeholder="Correo electrónico" class="w-full" />
        <button pButton type="submit" label="Enviar" class="w-full" [disabled]="form.invalid || loading">
        </button>
        @if (success) {
          <div class="text-green-600 text-sm text-center mt-2">¡Correo enviado!</div>
        }
        @if (error) {
          <div class="text-red-600 text-sm text-center mt-2">{{ error }}</div>
        }
      </form>
      <div auth-footer class="flex flex-col gap-2 text-center mt-4">
        <a href="#" class="text-sm text-gray-500 hover:underline">Volver a iniciar sesión</a>
      </div>
    </app-auth-layout>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });
  loading = false;
  error: string | null = null;
  success = false;

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.success = false;
    const { email } = this.form.value;
    this.auth.forgotPassword({ email: email ?? '' }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: (err: { error: { message: string; }; }) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al enviar el correo';
      }
    });
  }
} 