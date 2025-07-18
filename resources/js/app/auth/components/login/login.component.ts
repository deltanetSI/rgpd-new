import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [ ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, FloatLabelModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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

      this.router.navigate(['/dashboard']); 
      
      this.loading = false; 
      
      window.location.reload();

      
      },
      error: (err: { error: { message: string; }; }) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al iniciar sesión';
      }
    });
  }
} 