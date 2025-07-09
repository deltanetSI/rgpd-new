import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UpdateProfileDto } from '../interfaces/auth.dto';

export class UpdateProfileUseCase {
  private http = inject(HttpClient);

  execute(dto: UpdateProfileDto) {
    // PUT /user/profile-information (Laravel Fortify)
    return this.http.put('/user/profile-information', dto, { withCredentials: true });
  }
} 