import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrimeNG } from 'primeng/config';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private primeng = inject(PrimeNG);
  private auth = inject(AuthService);

  ngOnInit() {
    this.auth.loadUser();
    this.primeng.ripple.set(true);
  }
}
