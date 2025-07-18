import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../core/environments/environment';
import { DocumentListResponseDto } from '../interfaces/document-response-dto';

@Injectable({
  providedIn: 'root' // Esto hace que el servicio sea un singleton y esté disponible en toda la aplicación
})

export class DocumentationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLegalDocuments() {
    return this.http.get<DocumentListResponseDto>(`${this.apiUrl}/documentation/legal`);
  }

  uploadLegalDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string }>(`${this.apiUrl}/documentation/legal`, formData);
  }

  deleteLegalDocument(filename: string) {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/documentation/legal/${encodeURIComponent(filename)}`);
  }

  getAepdDocuments() {
    return this.http.get<DocumentListResponseDto>(`${this.apiUrl}/documentation/aepd`);
  }

  uploadAepdDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ message: string }>(`${this.apiUrl}/documentation/aepd`, formData);
  }

  deleteAepdDocument(filename: string) {
    return this.http.delete<{ deleted: boolean }>(`${this.apiUrl}/documentation/aepd/${encodeURIComponent(filename)}`);
  }
} 