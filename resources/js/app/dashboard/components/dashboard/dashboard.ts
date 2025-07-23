import { Component } from '@angular/core';
import { WidgetExportDataprotection } from '../widget-export-dataprotection/widget-export-dataprotection';
import { WidgetExerciseOfRights } from '../widget-exercise-of-rights/widget-exercise-of-rights';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetExportDataprotection, WidgetExerciseOfRights],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent {

}