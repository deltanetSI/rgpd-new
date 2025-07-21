import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table'; // Importamos Table y TableModule
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Datatable } from '../../../shared/components/datatable/datatable';
import { Createcompany } from '../createcompany/create-company';
import { CompanyService } from '../../services/company-service';
import { CompanyResponseDto } from '../../interfaces/company-response-dto';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    Datatable,
    Createcompany
  ],
  templateUrl: './companies.html',
  styleUrls: ['./companies.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class OrganizationComponent implements OnInit {

  showDialogFlag = false;

  companies: CompanyResponseDto[] = []; // Ahora el tipo es CompanyResponseDto[]
  private cdr = inject(ChangeDetectorRef); 

  private companyService= inject(CompanyService);

  cols = [
    { field: 'name', header: 'Nombre', filter: true, minWidth: '200px' },
    { field: 'legal_name', header: 'Razón social', filter: true, minWidth: '300px' },
    { field: 'tax_id', header: 'CIF', filter: true },
    { field: 'dpd_id', header: 'DPD', filter: true },
    { field: 'city', header: 'Ciudad', filter: true, minWidth: '150px'  },
    { field: 'address', header: 'Dirección', filter: true, minWidth: '150px'  },
    { field: 'country', header: 'País', filter: true, minWidth: '150px'  },
    { field: 'postal_code', header: 'Código postal', filter: true, minWidth: '200px'  },
    { field: 'registered_address', header: 'Dirección registrada', filter: true, minWidth: '300px' },
    { field: 'province', header: 'Provincia', filter: true, minWidth: '150px'  },
    { field: 'phone', header: 'Teléfono', filter: true , minWidth: '150px' },
    { field: 'email', header: 'Email', filter: true },
    { field: 'activity', header: 'Actividad', filter: true, minWidth: '150px'  },
    { field: 'number_of_employees', header: 'Número de empleados', filter: true, minWidth: '200px'  },
    { field: 'external_hosting', header: 'Hosting externo', filter: true, minWidth: '200px'  },
    { field: 'data_sharing', header: 'Compartir datos', filter: true, minWidth: '200px'  },
    { field: 'international_transfers', header: 'Transferencias internacionales', filter: true, minWidth: '300px'  },
    { field: 'mass_mailing', header: 'Mailing masivo', filter: true , minWidth: '200px' },
    { field: 'dpd_id', header: 'DPD', filter: true },
  ];

  ngOnInit(): void {
    this.loadCompanies(); 
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (data: CompanyResponseDto[]) => {
        this.companies = data; 
        console.log('Compañías cargadas desde la API:', this.companies);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las compañías:', err);
      }
    });
  }

  globalFilterFields = ['name', 'legal_name', 'tax_id', 'dpd_id', 'email', 'phone', 'city', 'province', 'country'];

  handleDialogClose() {
    this.showDialogFlag = false;
  }
}