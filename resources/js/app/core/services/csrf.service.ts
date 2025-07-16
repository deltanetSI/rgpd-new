import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CsrfService {
  constructor(private http: HttpClient) {}

  /**
   * Solicita la cookie CSRF a Laravel Sanctum.
   * Siempre debe llamarse antes de login/register.
   */
  getCsrfCookie(apiBaseUrl: string) {
    return this.http.get(`${apiBaseUrl}/sanctum/csrf-cookie`, { withCredentials: true });
  }
} 