import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';
import { UpdatePasswordDto } from '../interfaces/auth.dto';
import { Observable, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdatePasswordUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  execute(dto: UpdatePasswordDto): Observable<{ message: string }> {
    return this.csrf.getCsrfCookie(environment.apiBaseUrl).pipe<{ message: string }>(
      switchMap(() => {
        return this.http.put<{ message: string }>(`${environment.apiUrl}/user/password`, dto, { withCredentials: true });
      })
    );
  }
} 