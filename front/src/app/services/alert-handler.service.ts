import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AlertHandlerService {
  constructor(private toastr: ToastrService) {}

  /**
   * Diccionario de mensajes de respuesta que en su key
   * esta los tipos de estados HTTP
   */

  private readonly MESSAGES_HTTP = {
    200: 'OK',
    201: 'Creado correctamente',
    204: 'Actualizado correctamente',
    400: 'Solicitud incorrecta',
    401: 'No autorizado',
    403: 'Prohibido',
    404: 'Registro no encontrado',
    409: 'Conflicto',
    500: 'Error interno del servidor',
  };

  /**
   * Funcion que administra el tipo de alerta
   * que debe que imprimir, en este esta la configuracion del toast
   * @param type
   * @param title
   * @param message
   * @returns ngx-toastr
   */

  private showToast(
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    message: string,
  ): void {
    const toastrMethod = {
      success: this.toastr.success.bind(this.toastr),
      warning: this.toastr.warning.bind(this.toastr),
      danger: this.toastr.error.bind(this.toastr),
      info: this.toastr.info.bind(this.toastr),
    }[type];

    toastrMethod(message, title, {
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
    });
  }

  /**
   * Imprime una alerta para response HTTP exitosos o erroneo (2** - 3** - 4**).
   * @param {*} StatusCode: number, Mesdage: string
   * @returns ngx-toastr
   */

  alertResponse(
    StatusCode: number,
    Message: string,
    titleChange?: string,
  ): void {
    const msg =
      Message ||
      this.MESSAGES_HTTP[StatusCode as keyof typeof this.MESSAGES_HTTP] ||
      'Respuesta desconocida';

    const statusMap = [
      { range: [200, 299], type: 'success', title: '¡Éxito!' },
      { range: [400, 499], type: 'warning', title: '¡Error de solicitud!' },
      { range: [500, 599], type: 'danger', title: '¡Error del servidor!' },
    ];

    const statusConfig = statusMap.find(
      ({ range }) => StatusCode >= range[0] && StatusCode <= range[1],
    ) || { type: 'info', title: 'Información' };
    this.showToast(
      statusConfig.type as 'success' | 'warning' | 'danger' | 'info',
      titleChange ? titleChange : statusConfig.title,
      msg,
    );
  }
}
