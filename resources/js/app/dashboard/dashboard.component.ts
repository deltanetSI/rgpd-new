import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <h2>Welcome to the Dashboard!</h2>
    <p>This is your main application content.</p>
  `,
  styles: [`
    h2 { color: #333; }
    p { color: #666; }
  `]
})
export class DashboardComponent {

}