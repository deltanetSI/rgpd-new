import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table'; // Importamos Table y TableModule
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { Datatable } from '../../../shared/components/datatable/datatable';


interface Organization {
  id: number;
  name: string;
  companyName: string;
  cif: string;
  dpd: string;
  managers: string;
  user: string;
}



@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    Datatable
  ],
  templateUrl: './organization.html',
  styleUrls: ['./organization.css']
})



export class OrganizationComponent {

  // Datos de prueba
  organizations: Organization[] = [
    {
      id: 1,
      name: 'Asociación de Titulados en Ingeniería Informática',
      companyName: 'Secretaría Técnica ALI',
      cif: 'P74125896',
      dpd: 'Deltanet',
      managers: 'Angel',
      user: 'Asociación de Titulados en Ingeniería Informática'
    },
    {
      id: 2,
      name: 'AutoMoto',
      companyName: 'Automoto Tomelloso, SL',
      cif: 'B12345678',
      dpd: 'Deltanet',
      managers: 'Maria',
      user: 'Deltanet'
    },
    {
      id: 3,
      name: 'COIICLM',
      companyName: 'Colegio de Ingenieros en Informática de CLM',
      cif: 'B12345567',
      dpd: 'Deltanet',
      managers: 'Alba',
      user: 'Deltanet'
    },
    {
      id: 4,
      name: 'COIICM',
      companyName: 'COLEGIO INGENIEROS INFORMATICA COMUNIDAD DE MADRID',
      cif: 'A00000000',
      dpd: 'Deltanet',
      managers: 'Lucia',
      user: 'Asociación de Titulados en Ingeniería Informática'
    },
    {
      id: 5,
      name: 'COMUNIDAD ROQUE NUBLO',
      companyName: 'COMUNIDAD ROQUE NUBLO',
      cif: 'A12345678',
      dpd: 'Deltanet',
      managers: 'Alberto',
      user: 'Deltanet'
    },
    {
      id: 6,
      name: 'Laboratorio PROTSAN',
      companyName: 'José Antonio Sanchez Escudero',
      cif: 'A00000055',
      dpd: 'Deltanet',
      managers: 'Juan',
      user: 'Deltanet'
    }
  ];


  cols = [
    { field: 'name', header: 'Nombre', filter: true, minWidth: '360px' },
    { field: 'companyName', header: 'Razón social', filter: true, minWidth: '300px' },
    { field: 'cif', header: 'CIF', filter: true },
    { field: 'dpd', header: 'DPD', filter: true },
    { field: 'managers', header: 'Encargados', filter: true, minWidth: '130px' },
    { field: 'user', header: 'Usuario', filter: true, minWidth: '400px' }
  ];

  globalFilterFields = ['name', 'companyName', 'cif', 'dpd', 'managers', 'user'];

  handleEdit(organization: Organization) {
    console.log('Editar:', organization);
  }

  handleDelete(organization: Organization) {
    console.log('Eliminar:', organization);
  }


}