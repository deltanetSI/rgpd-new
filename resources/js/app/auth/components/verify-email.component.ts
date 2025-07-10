import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthLayout } from '../layouts/auth-layout';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-verify-email',
  standalone: true,
  imports: [AuthLayout, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-auth-layout>
      <div auth-header>
        <h2 class="text-2xl font-bold text-center mb-2">Verifica tu correo</h2>
        <p class="text-center text-gray-500 mb-4">Hemos enviado un enlace de verificación a tu correo electrónico.</p>
      </div>
      <div class="flex flex-col gap-4 items-center">
        <button pButton class="w-full" (click)="onResend()" [disabled]="loading">
          <span>Reenviar correo</span>
        </button>
        @if (success) {
          <span class="text-green-600">¡Correo reenviado!</span>
        }
        @if (error) {
          <span class="text-red-600">{{ error }}</span>
        }
      </div>
      <div auth-footer class="flex flex-col gap-2 text-center mt-4">
        <a href="#" class="text-sm text-gray-500 hover:underline">¿No recibiste el correo? Revisa tu carpeta de spam.</a>
      </div>
    </app-auth-layout>
  `
})
export class VerifyEmailComponent {
  private auth = inject(AuthService);
  loading = false;
  success = false;
  error: string | null = null;

  onResend() {
    this.loading = true;
    this.success = false;
    this.error = null;
    // Aquí deberías llamar a un endpoint tipo /email/verification-notification
    this.auth['http'].post('/email/verification-notification', {}, { withCredentials: true }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al reenviar el correo';
      }
    });
  }
} 