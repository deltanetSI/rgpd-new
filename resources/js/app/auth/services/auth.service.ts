import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, throwError, BehaviorSubject } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../core/environments/environment';

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

@Injectable({ providedIn: 'root' })
export class AuthService {
  // --- INYECCIÓN DE DEPENDENCIAS ---
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private loginUseCase = inject(LoginUseCase);
  private registerUseCase = inject(RegisterUseCase);
  private forgotPasswordUseCase = inject(ForgotPasswordUseCase);
  private resetPasswordUseCase = inject(ResetPasswordUseCase);
  private updatePasswordUseCase = inject(UpdatePasswordUseCase);
  private updateProfileUseCase = inject(UpdateProfileUseCase);

  // --- GESTIÓN DE ESTADO MODERNA (CON SIGNALS) ---
  // El signal es ahora la ÚNICA fuente de verdad para el estado del usuario.
  private userSignal = signal<User | null>(null);

  // Exponemos el signal como readonly para protegerlo de modificaciones externas.
  public readonly user = this.userSignal.asReadonly();

  // El estado de autenticación se calcula directamente a partir del signal.
  public readonly isAuthenticated = computed(() => !!this.user());

  // Si alguna parte de tu app aún necesita un observable, lo creamos a partir del signal.
  public user$: Observable<User | null> = toObservable(this.userSignal);

  private authStatusChecked = new BehaviorSubject<boolean>(false);
  public isAuthStatusChecked$ = this.authStatusChecked.asObservable();

  // Este observable ahora actualiza el signal directamente.
  public userLoadedCheck$: Observable<User | null> = this.http.get<User>(`${environment.apiUrl}/user`, { withCredentials: true })
    .pipe(
      tap(user => this.userSignal.set(user)), // Actualiza el signal con el usuario
      catchError(() => {
        this.userSignal.set(null); // Limpia el signal en caso de error
        return of(null);
      }),
      finalize(() => this.authStatusChecked.next(true)),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  constructor() {
    // La lógica para SSR se mantiene, pero ya no necesitamos sincronizar un subject y un signal.
    if (isPlatformBrowser(this.platformId)) {
      this.userLoadedCheck$.subscribe();
    } else {
      this.authStatusChecked.next(true);
    }
  }

  // --- MÉTODOS PÚBLICOS DE AUTENTICACIÓN ---

  login(dto: LoginDto): Observable<User> {
    return this.loginUseCase.execute(dto).pipe(
      tap(user => {
        // Al completar el login, actualizamos directamente el signal.
        this.userSignal.set(user);
      })
    );
  }

  register(dto: RegisterDto): Observable<User> {
    return from(this.registerUseCase.execute(dto)).pipe(
      switchMap(() => this.fetchAndSetUser())
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${environment.authUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => this.clearLocalData()),
      catchError((error) => {
        this.clearLocalData();
        return throwError(() => error);
      })
    );
  }

  public handleAuthError(): void {
    this.clearLocalData();
  }

  updateProfile(dto: UpdateProfileDto): Observable<User> {
    return from(this.updateProfileUseCase.execute(dto)).pipe(
      switchMap(() => this.fetchAndSetUser())
    );
  }

  fetchAndSetUser(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user`, { withCredentials: true }).pipe(
      tap(user => this.userSignal.set(user)) // También actualiza el signal
    );
  }

  // --- LÓGICA DE LIMPIEZA ---

  private clearLocalData(): void {
    this.userSignal.set(null); // Limpia el estado directamente en el signal.
    this.clearAppCookies();
  }

  private clearAppCookies(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }

  // --- MÉTODOS QUE NO AFECTAN AL ESTADO DE LOGIN ---

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
}

  /* hasRole(role: string): boolean {
    return !!this.user()?.roles?.includes(role);
  }

  hasPermission(permission: string): boolean {
    return !!this.user()?.permissions?.includes(permission);
  } */
