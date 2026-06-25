import { ChangeDetectionStrategy, Component } from '@angular/core';
import { INoRowsOverlayAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-no-rows-overlay',
  imports: [],
  templateUrl: './no-rows-overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoRowsOverlayComponent implements INoRowsOverlayAngularComp {
  agInit(): void {}
}
