import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DocumentationList } from '../../../shared/components/documentation-list/documentation-list';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { listAepdDocumentsUsecase } from '../../usecases/list-aepd-documents.usecase';
import { uploadAepdDocumentUsecase } from '../../usecases/upload-aepd-document.usecase';
import { deleteAepdDocumentUsecase } from '../../usecases/delete-aepd-document.usecase';

@Component({
  selector: 'app-aepd',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    DocumentationList,
    ConfirmPopupModule
  ],
  providers: [ConfirmationService],
  templateUrl: './aepd.html',
  styleUrl: './aepd.css'
})
export class Aepd implements OnInit {
  private readonly aepdDocs = listAepdDocumentsUsecase();
  private readonly uploadAepd = uploadAepdDocumentUsecase();
  private readonly deleteAepd = deleteAepdDocumentUsecase();
  private readonly confirmationService = inject(ConfirmationService);

  documents = this.aepdDocs.documents;
  loading = computed(() => this.aepdDocs.loading() || this.uploadAepd.loading() || this.deleteAepd.loading());
  message = signal<string | null>(null);

  ngOnInit() {
    this.aepdDocs.load();
  }

  onUpload(file: File) {
    this.uploadAepd.upload(file);
    const msg = this.uploadAepd.message();
    if (msg) {
      this.message.set(msg);
      this.aepdDocs.load();
    }
  }

  onDelete(doc: { name: string }, event?: Event) {
    this.confirmationService.confirm({
      target: event?.currentTarget as HTMLElement,
      message: `¿Seguro que quieres eliminar el documento "${doc.name}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, borrar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.deleteAepd.remove(doc.name);
        const deleted = this.deleteAepd.deleted();
        if (deleted) {
          this.message.set('Documento eliminado correctamente');
          this.aepdDocs.load();
        }
      }
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.onUpload(input.files[0]);
      input.value = '';
    }
  }
}
