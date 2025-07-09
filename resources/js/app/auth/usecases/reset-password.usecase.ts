import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResetPasswordDto } from '../interfaces/auth.dto';

export class ResetPasswordUseCase {
  private http = inject(HttpClient);

  execute(dto: ResetPasswordDto) {
    // POST /reset-password (Laravel Fortify)
    return this.http.post('/reset-password', dto);
  }
} 