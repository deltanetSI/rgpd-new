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
import { from, switchMap, tap } from 'rxjs';
import { environment } from '../../core/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private loginUseCase = inject(LoginUseCase);
  private registerUseCase = inject(RegisterUseCase);
  private forgotPasswordUseCase = inject(ForgotPasswordUseCase);
  private resetPasswordUseCase = inject(ResetPasswordUseCase);
  private updatePasswordUseCase = inject(UpdatePasswordUseCase);
  private updateProfileUseCase = inject(UpdateProfileUseCase);

  private userSignal = signal<User | null>(null);
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());

  private userLoadedSignal = signal(false);
  readonly userLoaded = computed(() => this.userLoadedSignal());

  loadUser() {
    //console.log('Llamando a /user');
    this.http.get<User>(`${environment.apiUrl}/user`, { withCredentials: true })
      .subscribe({
        next: user => {
          //console.log('Usuario cargado', user);
          this.userSignal.set(user);
          this.userLoadedSignal.set(true);
        },
        error: () => {
          //console.log('Error al cargar usuario', err);
          this.userSignal.set(null);
          this.userLoadedSignal.set(true);
        }
      });
  }

  login(dto: LoginDto) {
    return from(this.loginUseCase.execute(dto)).pipe(
      switchMap(response => response),
      tap(() => this.loadUser())
    );
  }

  register(dto: RegisterDto) {
    return from(this.registerUseCase.execute(dto)).pipe(
      switchMap(response => response),
      tap(() => this.loadUser())
    );
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return from(this.forgotPasswordUseCase.execute(dto)).pipe(
      switchMap(response => response)
    );
  }

  resetPassword(dto: ResetPasswordDto) {
    return from(this.resetPasswordUseCase.execute(dto)).pipe(
      switchMap(response => response)
    );
  }

  updatePassword(dto: UpdatePasswordDto) {
    return from(this.updatePasswordUseCase.execute(dto)).pipe(
      switchMap(response => response)
    );
  }

  updateProfile(dto: UpdateProfileDto) {
    return from(this.updateProfileUseCase.execute(dto)).pipe(
      switchMap(response => response),
      tap(() => this.loadUser())
    );
  }

  logout() {
    return this.http.post('/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.userSignal.set(null))
    );
  }

  /* hasRole(role: string): boolean {
    return !!this.user()?.roles?.includes(role);
  }

  hasPermission(permission: string): boolean {
    return !!this.user()?.permissions?.includes(permission);
  } */
} 