import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateProfileDto } from '../interfaces/auth.dto';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';

export class UpdateProfileUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  async execute(dto: UpdateProfileDto) {
    await this.csrf.getCsrfCookie(environment.apiBaseUrl).toPromise();
    return this.http.put(`${environment.authUrl}/user/profile-information`, dto, { withCredentials: true });
  }
} 