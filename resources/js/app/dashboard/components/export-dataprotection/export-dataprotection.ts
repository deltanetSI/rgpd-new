import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ExportDataProtectionService } from '../../services/export-dataprotection-service';
import { saveAs } from 'file-saver';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-export-dataprotection',
  imports: [CardModule, ButtonModule, FileUploadModule, DividerModule, TooltipModule],
  templateUrl: './export-dataprotection.html',
  styleUrl: './export-dataprotection.css'
})
export class ExportDataprotection {

  private exportDataService=inject(ExportDataProtectionService);
  fileId: string | undefined;

  onFileSelected(event: { files: File[] }) {
    const file: File = event.files?.[0];
    if (file) {
      this.exportDataService.uploadExcelFile(file).subscribe({
        next: (res) => console.log('Respuesta del backend:', res),
        error: (err) => console.error('Error al subir archivo:', err)
      });
    }
  }


  downloadZip() {
    const downloadUrl = 'https://tuservidor.com/api/download'; // cambia esto por la URL real
    this.exportDataService.downloadZip(downloadUrl).subscribe({
      next: (blob) => saveAs(blob, 'archivo.zip'),
      error: (err) => console.error('Error al descargar ZIP:', err)
    });
  }

  sendEmails() {
    if (!this.fileId) {
      console.warn('No hay archivo subido aún.');
      return;
    }
    this.exportDataService.sendEmails({ fileId: this.fileId }).subscribe({
      next: (res) => console.log('Correo enviado:', res),
      error: (err) => console.error('Error al enviar email:', err)
    });
  }

}
