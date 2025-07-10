import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ForgotPasswordDto } from '../interfaces/auth.dto';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';

export class ForgotPasswordUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  async execute(dto: ForgotPasswordDto) {
    await this.csrf.getCsrfCookie(environment.apiBaseUrl).toPromise();
    return this.http.post(`${environment.authUrl}/forgot-password`, dto, { withCredentials: true });
  }
} 