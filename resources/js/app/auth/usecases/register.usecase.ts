import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterDto } from '../interfaces/auth.dto';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';

export class RegisterUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  async execute(dto: RegisterDto) {
    await this.csrf.getCsrfCookie(environment.apiBaseUrl).toPromise();
    return this.http.post(`${environment.authUrl}/register`, dto, { withCredentials: true });
  }
} 