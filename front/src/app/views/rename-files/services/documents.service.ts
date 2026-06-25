import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  DocFile,
  GenerarPruebaResponse,
  ProcesarResponse,
} from '../interfaces/doc.interface';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private _http = inject(HttpClient);

  getAllDocs(): Observable<DocFile[] | null> {
    return this._http
      .get<DocFile[]>(`${environment.API_URL}docs`)
      .pipe(catchError(() => of(null)));
  }

  generarPrueba(): Observable<GenerarPruebaResponse | null> {
    return this._http
      .post<GenerarPruebaResponse>(`${environment.API_URL}docs/generar-prueba`, {})
      .pipe(catchError(() => of(null)));
  }

  procesarDocumentos(): Observable<ProcesarResponse | null> {
    return this._http
      .post<ProcesarResponse>(`${environment.API_URL}processor/start`, {})
      .pipe(catchError(() => of(null)));
  }
}
