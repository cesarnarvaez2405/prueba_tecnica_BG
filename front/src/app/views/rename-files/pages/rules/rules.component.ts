import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import type { ColDef } from 'ag-grid-community';
import { firstValueFrom } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RulesService } from '../../services/rules.service';
import { TableComponent } from '../../../../components/table/table.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
import { CreateRuleDto, Rule } from './interfaces/rule.interface';

@Component({
  selector: 'app-rules',
  imports: [TableComponent],
  templateUrl: './rules.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RulesComponent {
  private _rulesService = inject(RulesService);
  private _modalService = inject(NgbModal);
  private _toastr = inject(ToastrService);

  includeInactive = signal(false);

  rulesResource = rxResource({
    request: () => ({
      includeInactive: this.includeInactive(),
    }),
    loader: ({ request }) =>
      this._rulesService.getAllRules(request.includeInactive),
  });

  defaultColDef: ColDef = {
    width: 150,
    cellStyle: { fontWeight: 'bold' },
  };

  colDefs: ColDef[] = [
    {
      field: 'pattern',
      headerName: 'Patrón',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'dateFormat',
      headerName: 'Formato fecha',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'outTemplate',
      headerName: 'Template salida',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'priority',
      headerName: 'Prioridad',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'isActive',
      headerName: 'Activa',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'fechaCreacion',
      headerName: 'Fecha creación',
      suppressMovable: true,
      resizable: false,
    },
    {
      field: 'fechaModificacion',
      headerName: 'Fecha modificación',
      suppressMovable: true,
      resizable: false,
    },
    {
      headerName: 'Acciones',
      suppressMovable: true,
      resizable: false,
      cellRenderer: (params: { data: Rule }) => {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '20px';
        container.style.justifyContent = 'center';

        const deleteIcon = document.createElement('a');
        deleteIcon.innerHTML = `<span style="cursor:pointer;color:#dc2626;font-weight:bold;">Eliminar</span>`;
        deleteIcon.title = 'Eliminar regla';
        deleteIcon.addEventListener('click', (event) => {
          event.stopPropagation();
          this.handleDelete(params.data);
        });

        container.appendChild(deleteIcon);
        return container;
      },
    },
  ];

  onIncludeInactiveChange(event: Event) {
    this.includeInactive.set((event.target as HTMLInputElement).checked);
  }

  async handleDelete(data: Rule) {
    const result = await firstValueFrom(this._rulesService.deleteRule(data.id));
    if (result) {
      this._toastr.success('Regla eliminada exitosamente', 'Regla eliminada');
      this.rulesResource.reload();
    } else {
      this._toastr.error('No se pudo eliminar la regla', 'Error');
    }
  }

  handleCreate() {
    const modalRef = this._modalService.open(CreateModalComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.title = 'Crear regla';
    modalRef.componentInstance.confirmText = 'Crear regla';
    modalRef.componentInstance.confirmFn = async (data: CreateRuleDto) => {
      const result = await firstValueFrom(this._rulesService.createRule(data));
      if (result) {
        this._toastr.success('Regla creada exitosamente', 'Regla creada');
        return true;
      }
      this._toastr.error('No se pudo crear la regla', 'Error');
      throw new Error('Error al crear la regla');
    };
    modalRef.result
      .then((result) => {
        if (result) {
          this.rulesResource.reload();
        }
      })
      .catch(() => {});
  }
}
