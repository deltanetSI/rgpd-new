import { DocumentationService } from '../services/documentation-service';
import { inject, signal, computed } from '@angular/core';

export function deleteLegalDocumentUsecase() {
  const documentationService = inject(DocumentationService);
  const loading = signal(false);
  const deleted = signal<boolean | null>(null);

  const remove = (filename: string) => {
    loading.set(true);
    deleted.set(null);
    documentationService.deleteLegalDocument(filename).subscribe({
      next: res => deleted.set(res.deleted),
      error: () => deleted.set(false),
      complete: () => loading.set(false)
    });
  };

  return {
    remove,
    loading: computed(() => loading()),
    deleted: computed(() => deleted())
  };
} 