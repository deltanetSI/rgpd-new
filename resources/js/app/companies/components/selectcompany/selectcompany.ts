import { ChangeDetectorRef, Component, Output, EventEmitter, Input, inject, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { CompanyService } from '../../services/company-service';
import { CompanyResponseDto } from '../../interfaces/company-response-dto';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ActiveCompanyService } from '../../services/active-company-service';

@Component({
  selector: 'app-selectcompany',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ListboxModule,
    FormsModule,
    ProgressBarModule
    , TooltipModule
  ],
  standalone: true,
  providers: [CompanyService],
  templateUrl: './selectcompany.html',
  styleUrl: './selectcompany.css'
})
export class Selectcompany implements OnChanges {

  private companyService = inject(CompanyService);

  private cdr = inject(ChangeDetectorRef);

  private activeCompanyService = inject(ActiveCompanyService);


  dialogHeader = "Cargando empresas"

  @Input() visible = false;

  // Evento para notificar al padre cuando se ha seleccionado una empresa
  @Output() companySelected = new EventEmitter<CompanyResponseDto>();

  // Evento para notificar al padre cuando se quiere crear una nueva empresa
  @Output() createNewCompany = new EventEmitter<void>();


  companies: CompanyResponseDto[] = [];

  selectedCompany: CompanyResponseDto | null = null;

  loadingCompanies = true;


  ngOnChanges(changes: SimpleChanges): void {

    if (changes['visible'] && this.visible) {
      this.dialogHeader = "Cargando empresas"
      this.loadCompanies();
    }

    if (changes['visible'] && !this.visible) {
      this.selectedCompany = null;
      this.cdr.detectChanges();
    }

  }

  loadCompanies(): void {

    this.loadingCompanies = true;

    this.companyService.getAllCompanies().subscribe({

      next: (data: CompanyResponseDto[]) => {

        this.companies = data;
        this.loadingCompanies = false;

        const activeCompanyId = this.activeCompanyService.getCurrentActiveCompanyId();
        if (activeCompanyId) {
          const foundCompany = this.companies.find(c => c.id === activeCompanyId);
          if (foundCompany) {
            this.selectedCompany = foundCompany;
            console.log('Selectcompany: Empresa activa pre-seleccionada:', foundCompany.name);
          } else {
            //this.activeCompanyService.clearActiveCompany();
          }
        }

          if (this.companies.length === 1) {
            this.selectedCompany = this.companies[0];
          }

          this.dialogHeader = "Seleccionar empresa"

          this.cdr.markForCheck();

        },
        error: (err) => {
          console.error('Error al cargar las compañías en el diálogo:', err);
          this.loadingCompanies = false;
        }
      });
  }


  onSelectCompany(): void {
    if (this.selectedCompany) {
      this.companySelected.emit(this.selectedCompany);
      this.visible = false;
    }
  }

  onCreateNewCompany(): void {
    this.createNewCompany.emit();
    this.visible = false;
  }


}
