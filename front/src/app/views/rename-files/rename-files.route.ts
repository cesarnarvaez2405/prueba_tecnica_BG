import { Route } from '@angular/router';
import { RenameFilesComponent } from './pages/rename-files/rename-files.component';
import { RulesComponent } from './pages/rules/rules.component';

export const RENAME_FILES_ROUTES: Route[] = [
  {
    path: '',
    data: { title: 'Rename Files' },
    component: RenameFilesComponent,
  },
  {
    path: 'rules',
    data: { title: 'Rules' },
    component: RulesComponent,
  },
];
