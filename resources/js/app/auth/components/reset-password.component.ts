import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthLayout } from '../layouts/auth-layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'auth-reset-password',
  standalone: true,
  imports: [AuthLayout, ReactiveFormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <auth-layout>
      <div auth-header>
        <h2 class="text-2xl font-bold text-center mb-2">Restablecer contraseña</h2>
        <p class="text-center text-gray-500 mb-4">Introduce tu nueva contraseña</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <input pInputText formControlName="email" type="email" placeholder="Correo electrónico" class="w-full" />
        <input pInputText formControlName="token" type="text" placeholder="Token" class="w-full" />
        <input pInputText formControlName="password" type="password" placeholder="Nueva contraseña" class="w-full" />
        <input pInputText formControlName="password_confirmation" type="password" placeholder="Repite la contraseña" class="w-full" />
        <button pButton type="submit" label="Restablecer" class="w-full" [disabled]="form.invalid || loading">
        </button>
        @if (success) {
          <div class="text-green-600 text-sm text-center mt-2">¡Contraseña restablecida!</div>
        }
        @if (error) {
          <div class="text-red-600 text-sm text-center mt-2">{{ error }}</div>
        }
      </form>
    </auth-layout>
  `
})
export class ResetPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    token: ['', Validators.required],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required]
  });
  loading = false;
  error: string | null = null;
  success = false;

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    this.success = false;
    const { email, token, password, password_confirmation } = this.form.value;
    this.auth.resetPassword({
      email: email ?? '',
      token: token ?? '',
      password: password ?? '',
      password_confirmation: password_confirmation ?? ''
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al restablecer la contraseña';
      }
    });
  }
} 