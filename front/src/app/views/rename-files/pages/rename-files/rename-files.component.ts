import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-rename-files',
  standalone: true,
  imports: [],
  templateUrl: './rename-files.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenameFilesComponent {}
