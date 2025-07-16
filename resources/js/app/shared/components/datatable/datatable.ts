import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

export interface ColumnConfig {
  field: string;
  header: string;
  filter?: boolean;
  minWidth?: string; 
}

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

  @ViewChild('dt') dt!: Table;

  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];

  @Input() rows = 10;
  @Input() rowsPerPageOptions = [10, 25, 50];

  globalFilterValue = '';
  showColumnFilters = false;

  // Habilitar para aquellas que tienen filtro true
  get globalFilterFields(): string[] {
    return this.columns.filter(col => col.filter).map(col => col.field);
  }

  toggleColumnFilters(): void {
    this.showColumnFilters = !this.showColumnFilters;
  }
}