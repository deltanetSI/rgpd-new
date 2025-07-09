import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthLayout } from '../layouts/auth-layout';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'auth-register',
  standalone: true,
  imports: [AuthLayout, ReactiveFormsModule, ButtonModule, InputTextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <auth-layout>
      <div auth-header>
        <h2 class="text-2xl font-bold text-center mb-2">Crear cuenta</h2>
        <p class="text-center text-gray-500 mb-4">Regístrate para acceder</p>
      </div>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
        <input pInputText formControlName="name" type="text" placeholder="Nombre completo" class="w-full" />
        <input pInputText formControlName="email" type="email" placeholder="Correo electrónico" class="w-full" />
        <input pInputText formControlName="password" type="password" placeholder="Contraseña" class="w-full" />
        <input pInputText formControlName="password_confirmation" type="password" placeholder="Repite la contraseña" class="w-full" />
        <button pButton type="submit" label="Registrarse" class="w-full" [disabled]="form.invalid || loading">
        </button>
        @if (error) {
          <div class="text-red-600 text-sm text-center mt-2">{{ error }}</div>
        }
      </form>
      <div auth-footer class="flex flex-col gap-2 text-center mt-4">
        <a href="#" class="text-sm text-gray-500 hover:underline">¿Ya tienes cuenta? Inicia sesión</a>
      </div>
    </auth-layout>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    password_confirmation: ['', Validators.required]
  });
  loading = false;
  error: string | null = null;

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = null;
    const { name, email, password, password_confirmation } = this.form.value;
    this.auth.register({
      name: name ?? '',
      email: email ?? '',
      password: password ?? '',
      password_confirmation: password_confirmation ?? ''
    }).subscribe({
      next: () => { this.loading = false; },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al registrarse';
      }
    });
  }
} 