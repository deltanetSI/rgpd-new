import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { CsrfService } from '../../core/services/csrf.service';
import { RegisterDto } from '../interfaces/auth.dto';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators'; // <-- Importa switchMap
import { User } from '../entities/user.entity';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  private http = inject(HttpClient);
  private csrf = inject(CsrfService);

  execute(dto: RegisterDto): Observable<User> { // <-- Devuelve un Observable<User>
    
    // 1. Pide el token CSRF. Esto devuelve un Observable.
    return this.csrf.getCsrfCookie(environment.apiBaseUrl).pipe(
      
      // 2. Cuando la llamada al CSRF se complete, switchMap ejecuta la siguiente.
      switchMap(() => {
        // Ahora sí, la cookie ya está lista para ser usada por HttpClient.
        return this.http.post<User>(`${environment.authUrl}/register`, dto, {
          withCredentials: true,
        });
      })
    );
  }
} 


