import { Component, ChangeDetectionStrategy, PLATFORM_ID, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton'; // <-- ¡Nuevo import!

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, CardModule, ToggleSwitchModule, FormsModule, SelectButtonModule],
  templateUrl: './auth-layout.html',
  styleUrls: ['./auth-layout.css'],
})
export class AuthLayout implements OnInit {

  isDark = false;
  private platformId = inject(PLATFORM_ID); 
  
  stateOptions: { label: string; value: boolean }[] = [ // Opciones para p-selectbutton
    { label: 'Claro', value: false }, // false para modo claro
    { label: 'Oscuro', value: true }  // true para modo oscuro
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedMode = localStorage.getItem('darkModeEnabled');
      this.isDark = storedMode === 'true';
      document.documentElement.classList.toggle('app-dark', this.isDark);
    }
  }

  toggleDarkModeWithSelectButton(event: { value: boolean }): void {
    
    const newIsDarkValue = event.value;

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('app-dark', newIsDarkValue);
      localStorage.setItem('darkModeEnabled', newIsDarkValue.toString());
    }
  }


} 