import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DocumentationList } from '../../../shared/components/documentation-list/documentation-list';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';
import { listLegalDocumentsUsecase } from '../../usecases/list-legal-documents.usecase';
import { uploadLegalDocumentUsecase } from '../../usecases/upload-legal-document.usecase';
import { deleteLegalDocumentUsecase } from '../../usecases/delete-legal-document.usecase';


@Component({
  selector: 'app-legal',
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
  templateUrl: './legal.html',
  styleUrl: './legal.css'
})
export class Legal implements OnInit {
  private readonly legalDocs = listLegalDocumentsUsecase();
  private readonly uploadLegal = uploadLegalDocumentUsecase();
  private readonly deleteLegal = deleteLegalDocumentUsecase();
  private readonly confirmationService = inject(ConfirmationService);

  documents = this.legalDocs.documents;
  loading = computed(() => this.legalDocs.loading() || this.uploadLegal.loading() || this.deleteLegal.loading());
  message = signal<string | null>(null);

  ngOnInit() {
    this.legalDocs.load();
  }

  onUpload(file: File) {
    this.uploadLegal.upload(file);
    const msg = this.uploadLegal.message();
    if (msg) {
      this.message.set(msg);
      this.legalDocs.load();
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
        this.deleteLegal.remove(doc.name);
        const deleted = this.deleteLegal.deleted();
        if (deleted) {
          this.message.set('Documento eliminado correctamente');
          this.legalDocs.load();
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
