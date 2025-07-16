import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';
import { LoginDto } from '../interfaces/auth.dto';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  async execute(dto: LoginDto) {
    await this.csrf.getCsrfCookie(environment.apiBaseUrl).toPromise();
    return this.http.post(`${environment.authUrl}/login`, dto, {
      withCredentials: true,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });  }
} 