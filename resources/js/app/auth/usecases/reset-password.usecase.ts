import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';
import { ResetPasswordDto } from '../interfaces/auth.dto';

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  async execute(dto: ResetPasswordDto) {
    await this.csrf.getCsrfCookie(environment.apiBaseUrl).toPromise();
    return this.http.post(`${environment.authUrl}/reset-password`, dto, { withCredentials: true });
  }
} 