import { DocumentationService } from '../services/documentation-service';
import { computed, signal } from '@angular/core';
import { DocumentItemDto } from '../interfaces/document-response-dto';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export function listAepdDocumentsUsecase() {
  const documentationService = inject(DocumentationService);
  const documents = signal<DocumentItemDto[]>([]);
  const loading = signal(false);

  const load = () => {
    loading.set(true);
    documentationService.getAepdDocuments().pipe(
      map(res => res.documents)
    ).subscribe({
      next: docs => documents.set(docs),
      complete: () => loading.set(false),
      error: () => loading.set(false)
    });
  };

  return {
    documents: computed(() => documents()),
    loading: computed(() => loading()),
    load
  };
} 