import { DocumentationService } from '../services/documentation-service';
import { inject, signal, computed } from '@angular/core';

export function uploadLegalDocumentUsecase() {
  const documentationService = inject(DocumentationService);
  const loading = signal(false);
  const message = signal<string | null>(null);

  const upload = (file: File) => {
    loading.set(true);
    message.set(null);
    documentationService.uploadLegalDocument(file).subscribe({
      next: res => message.set(res.message),
      error: () => message.set('Error al subir el documento'),
      complete: () => loading.set(false)
    });
  };

  return {
    upload,
    loading: computed(() => loading()),
    message: computed(() => message())
  };
} 