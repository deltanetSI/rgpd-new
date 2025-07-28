import { ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table'; 
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ColumnBodyContext, Datatable, ColumnConfig } from '../../../shared/components/datatable/datatable';
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
})

export class OrganizationComponent implements OnInit, AfterViewInit {

  // Referencia a la fila y la compania a editar
  @ViewChild('viewEditCompanyBodyTemplate') viewEditCompanyBodyTemplate!: TemplateRef<ColumnBodyContext<CompanyResponseDto>>;
  
  selectedCompanyForEdit: CompanyResponseDto | null = null; 

  loadingCompanies = true;

  showDialogFlag = false;

  companies: CompanyResponseDto[] = [];

  private cdr = inject(ChangeDetectorRef);

  private companyService = inject(CompanyService);

  cols: ColumnConfig<CompanyResponseDto>[] = [
    {
      header: '',
      field: 'actions',
      filter: false,
      minWidth: '80px'
    },
    { field: 'name', header: 'Nombre', filter: true, minWidth: '200px' },
    { field: 'legal_name', header: 'Razón social', filter: true, minWidth: '300px' },
    { field: 'tax_id', header: 'CIF', filter: true },
    { field: 'dpd_id', header: 'DPD', filter: true },
    { field: 'city', header: 'Ciudad', filter: true, minWidth: '150px' },
    { field: 'address', header: 'Dirección', filter: true, minWidth: '150px' },
    { field: 'country', header: 'País', filter: true, minWidth: '150px' },
    { field: 'postal_code', header: 'Código postal', filter: true, minWidth: '200px' },
    { field: 'registered_address', header: 'Dirección registrada', filter: true, minWidth: '300px' },
    { field: 'province', header: 'Provincia', filter: true, minWidth: '150px' },
    { field: 'phone', header: 'Teléfono', filter: true, minWidth: '150px' },
    { field: 'email', header: 'Email', filter: true },
    { field: 'activity', header: 'Actividad', filter: true, minWidth: '150px' },
    { field: 'number_of_employees', header: 'Número de empleados', filter: true, minWidth: '200px' },
    { field: 'external_hosting', header: 'Hosting externo', filter: true, minWidth: '200px' },
    { field: 'data_sharing', header: 'Compartir datos', filter: true, minWidth: '200px' },
    { field: 'international_transfers', header: 'Transferencias internacionales', filter: true, minWidth: '300px' },
    { field: 'mass_mailing', header: 'Mailing masivo', filter: true, minWidth: '200px' },
    { field: 'dpd_id', header: 'DPD', filter: true },
  ];

  globalFilterFields = ['name', 'legal_name', 'tax_id', 'dpd_id', 'email', 'phone', 'city', 'province', 'country'];


  ngAfterViewInit(): void {
    const actionsCol = this.cols.find(col => col.field === 'actions');
    if (actionsCol) {
      actionsCol.bodyTemplate = this.viewEditCompanyBodyTemplate; 
    }

    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loadingCompanies = true;	
    this.companyService.getAllCompanies().subscribe({
      next: (data: CompanyResponseDto[]) => {
        this.companies = data;
        console.log('Compañías cargadas desde la API:', this.companies);
        this.loadingCompanies = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar las compañías:', err);
        this.loadingCompanies = false;
        this.cdr.detectChanges();
      }
    });
  }

  onShowEditCompany(companyId: string): void { 

    this.companyService.getCompany(companyId).subscribe({
      next: (company: CompanyResponseDto) => {
        this.selectedCompanyForEdit = company; 
        this.showDialogFlag = true; 
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar la compañía para edición:', err);
      }
    });
  }

  onShowCreateCompanyDialog() {
    this.selectedCompanyForEdit = null; 
    this.showDialogFlag = true;
  }

  handleDialogClose() {
    this.showDialogFlag = false;
    this.selectedCompanyForEdit=null;
  }


  onCompanySaved(): void {
    this.loadCompanies();
  }


}