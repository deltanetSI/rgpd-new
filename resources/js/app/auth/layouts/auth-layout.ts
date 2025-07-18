import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports:[RouterOutlet],
  template: `
        <router-outlet></router-outlet>
  `
})
export class AuthLayout {} 