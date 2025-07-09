import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ForgotPasswordDto } from '../interfaces/auth.dto';

export class ForgotPasswordUseCase {
  private http = inject(HttpClient);

  execute(dto: ForgotPasswordDto) {
    // POST /forgot-password (Laravel Fortify)
    return this.http.post('/forgot-password', dto);
  }
} 