import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { computed } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  email_verified_at?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSignal = signal<User | null>(null);
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor(private http: HttpClient) {}

  // Métodos a implementar: login, logout, getUser, hasRole, hasPermission, etc.
} 