import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-screen flex items-center justify-center bg-gray-100">
      <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg flex overflow-hidden h-full">
        <!-- Columna izquierda: contenido centrado -->
        <div class="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 h-full">
          <div class="w-full max-w-sm">
            <ng-content select="[auth-header]"></ng-content>
            <ng-content></ng-content>
            <ng-content select="[auth-footer]"></ng-content>
          </div>
        </div>
        <!-- Columna derecha: favicon centrado sobre fondo gris claro -->
        <div class="hidden md:flex w-1/2 items-center justify-center bg-gray-200 h-full">
          <img src="/favicon.ico" alt="Logo" class="w-24 h-24 rounded shadow" />
        </div>
      </div>
    </div>
  `
})
export class AuthLayout {} 