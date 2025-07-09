import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdatePasswordDto } from '../interfaces/auth.dto';

export class UpdatePasswordUseCase {
  private http = inject(HttpClient);

  execute(dto: UpdatePasswordDto) {
    // PUT /user/password (Laravel Fortify)
    return this.http.put('/user/password', dto, { withCredentials: true });
  }
} 