import { Component } from '@angular/core';
import { ExportDataprotection } from '../export-dataprotection/export-dataprotection';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ExportDataprotection],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

}