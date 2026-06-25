import {
  ChangeDetectionStrategy,
  Component,
  inject,
  NgZone,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import type { ColDef } from 'ag-grid-community';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DocumentsService } from '../../services/documents.service';
import { TableComponent } from '../../../../components/table/table.component';
import { environment } from '../../../../../environments/environment';
import { ProcesarResumen } from '../../interfaces/doc.interface';

@Component({
  selector: 'app-rename-files',
  imports: [TableComponent],
  templateUrl: './rename-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameFilesComponent {
  private _documentsService = inject(DocumentsService);
  private _toastr = inject(ToastrService);
  private _ngZone = inject(NgZone);

  docsResource = rxResource({
    loader: () => this._documentsService.getAllDocs(),
  });

  defaultColDef: ColDef = {
    width: 150,
    cellStyle: { fontWeight: 'bold' },
  };

  colDefs: ColDef[] = [
    {
      field: 'archivoActual',
      headerName: 'Archivo actual',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'archivoOrigen',
      headerName: 'Archivo origen',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'nombreTransformado',
      headerName: 'Nombre transformado',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'estado',
      headerName: 'Estado',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'batchId',
      headerName: 'Batch ID',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'ruleId',
      headerName: 'Rule ID',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'processedAt',
      headerName: 'Fecha de proceso',
      suppressMovable: true,
      resizable: false,
    },
  ];

  async handleProcesarDocumentos() {
    const response = await firstValueFrom(
      this._documentsService.procesarDocumentos(),
    );
    if (response) {
      this._toastr.info(
        `Se enviaron ${response.archivosEnviados} archivos. Esperando resultado...`,
        'Procesamiento iniciado',
      );
      this.escucharEstadoProcesamiento(response.batchId);
    } else {
      this._toastr.error('No se pudo iniciar el procesamiento', 'Error');
    }
  }

  private escucharEstadoProcesamiento(batchId: string) {
    const eventSource = new EventSource(
      `${environment.API_URL}processor/status/${batchId}`,
    );

    eventSource.onmessage = (event) => {
      const resumen: ProcesarResumen = JSON.parse(event.data);
      eventSource.close();
      this._ngZone.run(() => {
        this._toastr.success(
          `<b>Total:</b> ${resumen.total}<br>
           <b>Transformados:</b> ${resumen.transformados}<br>
           <b>Errores:</b> ${resumen.errores}<br>
           <b>No mapeados:</b> ${resumen.noMapeados}`,
          'Procesamiento finalizado',
          { disableTimeOut: true, enableHtml: true, closeButton: true },
        );
        this.docsResource.reload();
      });
    };

    eventSource.onerror = () => {
      eventSource.close();
      this._ngZone.run(() => {
        this._toastr.error(
          'Error al obtener el estado del procesamiento',
          'Error',
        );
      });
    };
  }

  async handleGenerarPrueba() {
    const response = await firstValueFrom(
      this._documentsService.generarPrueba(),
    );
    if (response) {
      this._toastr.success(
        `Se generaron ${response.archivosGenerados} archivos`,
        'Archivos generados',
      );
      this.docsResource.reload();
    } else {
      this._toastr.error('No se pudieron generar los archivos', 'Error');
    }
  }
}
