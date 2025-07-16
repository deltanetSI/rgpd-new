import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
      <div auth-header>
        <h2 class="text-2xl font-bold text-center mb-2">Iniciar sesión</h2>
        <p class="text-center text-gray-500 mb-4">Accede a tu cuenta</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <input pInputText formControlName="email" type="email" placeholder="Correo electrónico" class="w-full" />
        <input pInputText formControlName="password" type="password" placeholder="Contraseña" class="w-full" />
        <button pButton type="submit" label="Entrar" class="w-full" [disabled]="form.invalid || loading">
        </button>
        @if (error) {
          <div class="text-red-600 text-sm text-center mt-2">{{ error }}</div>
        }
      </form>
      <div auth-footer class="flex flex-col gap-2 text-center mt-4">
        <a href="#" class="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
        <a href="#" class="text-sm text-gray-500 hover:underline">¿No tienes cuenta? Regístrate</a>
      </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  loading = false;
  error: string | null = null;

  private router = inject(Router);

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    const { email, password } = this.form.value;
    this.auth.login({ email: email ?? '', password: password ?? '' }).subscribe({
      next: () => { 
        this.loading = false; 
        this.router.navigate(['']); // O ['/dashboard']
      },
      error: (err: { error: { message: string; }; }) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al iniciar sesión';
      }
    });
  }
} 