export interface DocFile {
  archivoActual: string;
  archivoOrigen: string;
  nombreTransformado: string;
  estado: string;
  batchId: string;
  ruleId: string;
  errorMessage: string;
  processedAt: string;
}

export interface GenerarPruebaResponse {
  archivosGenerados: number;
  archivos: string[];
}

export interface ProcesarResponse {
  batchId: string;
  archivosEnviados: number;
  estado: string;
}

export interface ProcesarResumen {
  batchId: string;
  total: number;
  transformados: number;
  errores: number;
  noMapeados: number;
}
