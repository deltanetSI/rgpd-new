import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { ExportDataProtectionService } from '../../services/export-dataprotection-service';
import { saveAs } from 'file-saver';
import { TooltipModule } from 'primeng/tooltip';
import { HttpEventType } from '@angular/common/http';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-export-dataprotection',
  imports: [CardModule, ButtonModule, FileUploadModule, DividerModule, TooltipModule, MessageModule, ToastModule],
  templateUrl: './widget-export-dataprotection.html',
  styleUrl: './widget-export-dataprotection.css',
  providers: [MessageService],

})
export class WidgetExportDataprotection implements OnInit {

  @ViewChild('fileUploadRef') fileUploadRef!: FileUpload; 

  private messageService = inject(MessageService);
  private exportService = inject(ExportDataProtectionService);

  fileId: string | undefined;
  isProcessing = false;
  downloadZipUrl: string | null = null;
  sendMailBatchToken: string | null = null;
  currentOrganizationId: number | null = null;

  ngOnInit(): void {

    this.currentOrganizationId = 1; // Placeholder

    if (!this.currentOrganizationId) {
      console.warn('Advertencia: currentOrganizationId no está definido. Las operaciones de importación/exportación pueden fallar.');
    }

  }

  onUploadCsv(event: FileUploadHandlerEvent): void {
    if (!this.currentOrganizationId) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'ID de organización no disponible para la importación.'});
      return;
    }

    this.isProcessing = true; // Deshabilita los botones durante la subida y procesamiento
    this.downloadZipUrl = null; // Reinicia el estado de los botones de descarga/envío
    this.sendMailBatchToken = null;

    const file = event.files[0]; // El archivo CSV seleccionado

    this.exportService.importCsv(file, this.currentOrganizationId).subscribe({
      next: (responseEvent) => {


        if (responseEvent.type === HttpEventType.Response) {

          const response = responseEvent.body;
          this.messageService.add({severity: 'success', summary: 'Importación', detail: response.message});
          console.log('Respuesta de importación:', response);

          // Habilita los botones si la importación fue exitosa
          this.downloadZipUrl = response.download_url || null;
          this.sendMailBatchToken = response.send_mail_token || null;


          this.isProcessing = false; // Habilita los botones
          this.fileUploadRef.clear(); // Limpia el campo de subida de archivos


        }
      },
      error: (err) => {
        console.error('Error al importar empleados:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al importar empleados.'});
        this.isProcessing = false;
        this.downloadZipUrl = null; 
        this.sendMailBatchToken = null;
      }
    });
  }

  onDownloadContracts(): void {


    if (!this.downloadZipUrl || !this.currentOrganizationId || !this.sendMailBatchToken) {
      
    console.log(this.downloadZipUrl + " " + this.currentOrganizationId + " " + this.sendMailBatchToken)
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'No hay contratos generados para descargar o faltan datos.'});
      return;
    }

    // Extrae el nombre del archivo del URL de descarga completo
    const filename = this.downloadZipUrl.split('/').pop() || 'contratos.zip';

    this.exportService.downloadZip(
      this.currentOrganizationId,
      this.sendMailBatchToken,
      filename
    ).subscribe({
      next: (blob) => {
        saveAs(blob, filename);
        this.messageService.add({severity: 'success', summary: 'Descarga', detail: 'Contratos descargados correctamente.'});
      },
      error: (err) => {
        console.error('Error al descargar contratos:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al descargar contratos.'});
      }
    });
  }




  onSendContractsByEmail(): void {
    if (!this.sendMailBatchToken || !this.currentOrganizationId) {
      this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'No hay contratos disponibles para enviar o ID de organización.'});
      return;
    }

    this.isProcessing = true;
    this.exportService.sendContractsToEmployeesByEmail(this.currentOrganizationId, this.sendMailBatchToken).subscribe({
      next: (response) => {
        this.messageService.add({severity: 'success', summary: 'Envío', detail: response.message});
        console.log('Respuesta de envío de emails:', response);
        this.isProcessing = false;
        
        // limpiar el estado después de enviar los emails si no se pueden volver a descargar/enviar
        this.downloadZipUrl = null;
        this.sendMailBatchToken = null;
      },
      error: (err) => {
        console.error('Error al enviar contratos por email:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: err.error?.message || 'Error al enviar contratos por email.'});
        this.isProcessing = false;
      }
    });
  }



  onDownloadTemplate(): void {
    this.exportService.downloadTemplate().subscribe({
      next: (blob) => {
        saveAs(blob, 'plantilla_empleados.csv');
        this.messageService.add({severity: 'success', summary: 'Descarga', detail: 'Plantilla descargada correctamente.'});
      },
      error: (err) => {
        console.error('Error al descargar la plantilla:', err);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se pudo descargar la plantilla.'});
      }
    });
  }

}
