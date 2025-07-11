import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';
import { RegisterDto } from '../interfaces/auth.dto';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  async execute(dto: RegisterDto) {
    await this.csrf.getCsrfCookie(environment.apiBaseUrl).toPromise();
    return this.http.post(`${environment.authUrl}/register`, dto, { withCredentials: true });
  }
} 