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
        return this.httpClient.post<CompanyResponseDto>(environment.apiUrl + "/company", CompanyDto, { withCredentials: true });
    }

    // Obtener todas las compañías
    getAllCompanies(): Observable<CompanyResponseDto[]> {
        return this.httpClient.get<CompanyResponseDto[]>(`${environment.apiUrl}/companies/all`, { withCredentials: true });
    }

    updateCompany(id: string, companyDto: CompanyCreateDto): Observable<CompanyResponseDto> {
        return this.httpClient.put<CompanyResponseDto>(`${environment.apiUrl}/company/${id}`, companyDto);
    }

    // Obtener compania concreta
    getCompany(id: string): Observable<CompanyResponseDto> {
        return this.httpClient.get<CompanyResponseDto>(`${environment.apiUrl}/company/${id}`, { withCredentials: true });
    }

    // Borrar compania
    removeCompany(id: string): Observable<void> {
        return this.httpClient.delete<void>(`${environment.apiUrl}/company/${id}`, { withCredentials: true });
    }


}

