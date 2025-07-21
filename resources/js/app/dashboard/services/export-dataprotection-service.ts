import { environment } from '../../core/environments/environment';
import { map } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ExportDataProtectionService {

    private httpClient = inject(HttpClient);


    uploadExcelFile(file: File): Observable<any> {

        const formData: FormData = new FormData();

        formData.append('excel_file', file, file.name);

        // Configuración para reportar el progreso de la subida
        return this.httpClient.post(`${environment.apiUrl}/upload-excel`, formData, {
            reportProgress: true,
            observe: 'events',
            responseType: 'json'
        }).pipe(
            map((event: HttpEvent<any>) => {

                if (event.type === HttpEventType.UploadProgress) {
                    const percentDone = Math.round(100 * event.loaded / (event.total || 1));
                    console.log(`Progreso de subida: ${percentDone}%`);
                } else if (event.type === HttpEventType.Response) {
                    console.log('Archivo subido con éxito:', event.body);
                    return event.body;
                }
                return event;
            })
        );
    }


    downloadZip(downloadUrl: string): Observable<Blob> {
        return this.httpClient.get(downloadUrl, {
            responseType: 'blob'
        });
    }


    sendEmails(data: { fileId?: string }): Observable<any> {

        return this.httpClient.post(`${environment.apiUrl}/process-and-email`, data);

    }

}

