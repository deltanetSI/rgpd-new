import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';
import { UpdateProfileDto } from '../interfaces/auth.dto';
import { Observable, switchMap } from 'rxjs';
import { User } from '../entities/user.entity'; 
@Injectable({ providedIn: 'root' })
export class UpdateProfileUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  execute(dto: UpdateProfileDto): Observable<User> { 
    return this.csrf.getCsrfCookie(environment.apiBaseUrl).pipe<User>(
      switchMap(() => {
        return this.http.put<User>(`${environment.apiUrl}/user/profile`, dto, { withCredentials: true });
      })
    );
  }
} 