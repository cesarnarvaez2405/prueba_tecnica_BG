import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  input,
  linkedSignal,
  Output,
} from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  DomLayoutType,
  GridApi,
  GridReadyEvent,
  GridSizeChangedEvent,
  RowSelectedEvent,
  RowSelectionOptions,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { NoRowsOverlayComponent } from './no-rows-overlay/no-rows-overlay.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  standalone: true,
  imports: [AgGridAngular],
  selector: 'table-component',
  templateUrl: './table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    ag-grid-angular {
      height: 100% !important;
      width: 100%;
      min-height: 0;
    }
  `,
})
export class TableComponent {
  private gridApi!: GridApi<any>;
  public noRowsOverlayComponent = NoRowsOverlayComponent;

  @Input({ required: true }) colDefs!: ColDef[];
  @Input({ required: true }) rowData!: any[];
  @Input() defaultColDef: ColDef = {};
  @Input() domLayout: DomLayoutType = 'autoHeight';
  @Input() rowSelection: RowSelectionOptions | 'single' | 'multiple' = {
    mode: 'multiRow',
    checkboxes: false,
    headerCheckbox: false,
    enableClickSelection: false,
  };

  paginationPageSize = input<number>(10);
  isPaginationForData = input<boolean>(true);

  pageSize = linkedSignal<number>(this.paginationPageSize);

  @Output() rowChecked = new EventEmitter<any>();

  public theme = themeQuartz.withParams({
    backgroundColor: 'rgba(128, 128, 128, 0.027)',
    foregroundColor: '#2d3d4d',
    headerTextColor: '#ffffff',
    headerBackgroundColor: '#2d3d4d',
    oddRowBackgroundColor: 'rgb(0, 0, 0, 0.03)',
    headerColumnResizeHandleColor: '#ffffff',
    selectedRowBackgroundColor: 'rgba(0, 255, 0, 0.1)',
    headerFontWeight: 'bold',
    columnBorder: { width: 1, color: '#2d3d4d' },
    headerColumnBorder: {
      color: '#ffffff',
    },
    rangeSelectionBorderColor: 'rgba(0,0,0,0)',
    checkboxUncheckedBorderColor: 'rgba(8, 36, 67, 0.63)',
    checkboxUncheckedBackgroundColor: 'rgba(238, 246, 255, 0.61)',
    checkboxCheckedBackgroundColor: '#029a05',
    checkboxCheckedBorderColor: 'rgba(0, 255, 0, 0.1)',
    checkboxCheckedShapeColor: '#ffffff',
    checkboxIndeterminateBorderColor: '#ffffff',
  });

  public selectionColumnDef = {
    headerTooltip: 'Seleccionar',
    width: 61,
    maxWidth: 61,
  };

  public paginationPageSizeSelector: number[] = [10, 20, 50];

  autoSizeStrategy:
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy = {
    type: 'fitGridWidth',
  };

  onGridSizeChanged(params: GridSizeChangedEvent) {
    const gridWidth = document.querySelector('.ag-body-viewport')!.clientWidth;
    const columnsToShow: string[] = [];
    const columnsToHide: string[] = [];
    let totalColsWidth = 0;
    const allColumns = params.api.getColumns();
    if (allColumns && allColumns.length > 0) {
      for (let i = 0; i < allColumns.length; i++) {
        const column = allColumns[i];
        totalColsWidth += column.getMinWidth();
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.getColId());
        } else {
          columnsToShow.push(column.getColId());
        }
      }
    }
    params.api.setColumnsVisible(columnsToShow, true);
    params.api.setColumnsVisible(columnsToHide, false);
    window.setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 10);
  }

  onRowSelected(event: RowSelectedEvent) {
    this.rowChecked.emit({
      data: event.node.data,
      isSelected: event.node.isSelected(),
    });
  }

  onGridReady(params: GridReadyEvent) {
    if (params.api) {
      this.gridApi = params.api;
    }
  }
}
