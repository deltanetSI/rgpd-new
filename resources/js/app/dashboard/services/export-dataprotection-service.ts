import { environment } from '../../core/environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ExportDataProtectionService {

    private httpClient = inject(HttpClient);


    // Subir CSV
    importCsv(file: File, organizationId: number): Observable<any> {
        
         const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        formData.append('organization_id', organizationId.toString());

        return this.httpClient.post(`${environment.apiUrl}/employees/import`, formData, {

            reportProgress: true,
            observe: 'events', // <-- Esto es lo que hace que devuelva HttpEvent
            responseType: 'json'

        });

    }


    // Descargar ZIP con todos los pdf
    downloadZip(organizationId: number, batchToken: string, filename: string): Observable<Blob> {
        // Laravel espera los parámetros en la query string
        const downloadUrl = `${environment.apiUrl}/employees/download-zip?organization_id=${organizationId}&batch=${batchToken}&file=${filename}`;
        return this.httpClient.get(downloadUrl, {
            responseType: 'blob'
        });
    }


    // Enviar EMAILS

    sendContractsToEmployeesByEmail(organizationId: number, batchToken: string): Observable<any> {
        const payload = {
            organization_id: organizationId,
            batch: batchToken
        };
        return this.httpClient.post(`${environment.apiUrl}/employees/send-contracts`, payload);
    }


    // Descargar plantilla
    downloadTemplate(): Observable<Blob> {
        return this.httpClient.get(`${environment.apiUrl}/employees/template`, {
            responseType: 'blob'
        });
    }

}

