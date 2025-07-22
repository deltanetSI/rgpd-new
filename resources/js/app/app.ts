import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { AuthService } from './auth/services/auth.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AsyncPipe } from '@angular/common';
import { Observable, combineLatest, timer } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProgressSpinnerModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private primeng = inject(PrimeNG);
  public authService = inject(AuthService);

  // Nuevo observable para controlar la visibilidad
  showContent$: Observable<boolean>;

  constructor() {
    // Combinamos el estado de autenticación con un temporizador de 1 segundo
    this.showContent$ = combineLatest([
      this.authService.isAuthStatusChecked$,
      timer(1000) // Espera al menos 1000 ms
    ]).pipe(
      // Solo emitimos true cuando ambos observables han emitido
      map(([isAuthChecked]) => isAuthChecked)
    );
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
  }
}
