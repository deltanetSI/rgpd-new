import { Component, Input, ViewChild, inject, PLATFORM_ID} from '@angular/core'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Table, TableModule } from 'primeng/table'; 
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';

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
    InputIconModule,
    SkeletonModule
  ],
  templateUrl: './datatable.html',
  styleUrls: ['./datatable.css']
})
export class Datatable<T extends object> { // <T extends object> para asegurar que sea un objeto

  @ViewChild('dt') dt!: Table;

  @Input() columns: ColumnConfig[] = [];
  @Input() data: T[] = [];

  @Input() rows = 10;
  @Input() rowsPerPageOptions = [10, 25, 50];

  // Inyecciones
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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