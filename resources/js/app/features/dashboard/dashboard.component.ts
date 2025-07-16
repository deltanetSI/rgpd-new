import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <h2>Dashboard</h2>
    <p>Éste es el dashboard principal</p>
  `,
  styles: [`
    h2 { color: #333; }
    p { color: #666; }
  `]
})
export class DashboardComponent {

}