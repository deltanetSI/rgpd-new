import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../entities/user.entity';
import {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  UpdateProfileDto
} from '../interfaces/auth.dto';
import { LoginUseCase } from '../usecases/login.usecase';
import { RegisterUseCase } from '../usecases/register.usecase';
import { ForgotPasswordUseCase } from '../usecases/forgot-password.usecase';
import { ResetPasswordUseCase } from '../usecases/reset-password.usecase';
import { UpdatePasswordUseCase } from '../usecases/update-password.usecase';
import { UpdateProfileUseCase } from '../usecases/update-profile.usecase';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private loginUseCase = new LoginUseCase();
  private registerUseCase = new RegisterUseCase();
  private forgotPasswordUseCase = new ForgotPasswordUseCase();
  private resetPasswordUseCase = new ResetPasswordUseCase();
  private updatePasswordUseCase = new UpdatePasswordUseCase();
  private updateProfileUseCase = new UpdateProfileUseCase();

  private userSignal = signal<User | null>(null);
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());

  // Cargar usuario actual (GET /api/user)
  getUser() {
    return this.http.get<User>('/api/user', { withCredentials: true }).pipe(
      tap(user => this.userSignal.set(user))
    );
  }

  login(dto: LoginDto) {
    return this.loginUseCase.execute(dto).pipe(
      tap(() => this.getUser().subscribe())
    );
  }

  register(dto: RegisterDto) {
    return this.registerUseCase.execute(dto).pipe(
      tap(() => this.getUser().subscribe())
    );
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return this.forgotPasswordUseCase.execute(dto);
  }

  resetPassword(dto: ResetPasswordDto) {
    return this.resetPasswordUseCase.execute(dto);
  }

  updatePassword(dto: UpdatePasswordDto) {
    return this.updatePasswordUseCase.execute(dto);
  }

  updateProfile(dto: UpdateProfileDto) {
    return this.updateProfileUseCase.execute(dto).pipe(
      tap(() => this.getUser().subscribe())
    );
  }

  logout() {
    return this.http.post('/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.userSignal.set(null))
    );
  }

  // Métodos de ayuda
  hasRole(role: string): boolean {
    return !!this.user()?.roles?.includes(role);
  }

  hasPermission(permission: string): boolean {
    return !!this.user()?.permissions?.includes(permission);
  }
} 