import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Necesitas HttpClient para hacer peticiones HTTP
import { Observable } from 'rxjs'; // Para manejar operaciones asíncronas
import { CompanyCreateDto } from '../interfaces/company-create-dto';
import { environment } from '../../core/environments/environment';
import { CompanyResponseDto } from '../interfaces/company-response-dto';

@Injectable({
    providedIn: 'root' // Esto hace que el servicio sea un singleton y esté disponible en toda la aplicación
})

export class CompanyService {

    private httpClient = inject(HttpClient);

    // Crear 
    createCompany(CompanyDto: CompanyCreateDto): Observable<CompanyResponseDto> {
        return this.httpClient.post<CompanyResponseDto>(environment.apiUrl + "/company", CompanyDto);
    }

 




}

