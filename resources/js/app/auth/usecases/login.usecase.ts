import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginDto } from '../interfaces/auth.dto';

export class LoginUseCase {
  private http = inject(HttpClient);

  execute(dto: LoginDto) {
    // POST /login (Laravel Fortify)
    return this.http.post('/login', dto, { withCredentials: true });
  }
} 