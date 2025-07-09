import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterDto } from '../interfaces/auth.dto';

export class RegisterUseCase {
  private http = inject(HttpClient);

  execute(dto: RegisterDto) {
    // POST /register (Laravel Fortify)
    return this.http.post('/register', dto, { withCredentials: true });
  }
} 