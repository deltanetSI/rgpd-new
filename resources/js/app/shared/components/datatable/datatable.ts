import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon'; // ¡Añade esta línea!

@Component({
  selector: 'app-datatable',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    FormsModule,
    IconFieldModule,
    InputIconModule 
  ],
  templateUrl: './datatable.html',
  styleUrls: ['./datatable.css']
})
export class Datatable {

  @Input() columns: { field: string; header: string; filter?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() globalFilterFields: string[] = [];
  @Input() rows = 10;
  @Input() rowsPerPageOptions = [10, 25, 50];

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  globalFilterValue: string = '';

}
