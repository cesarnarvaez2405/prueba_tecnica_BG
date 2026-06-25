import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'rename-files',
    loadChildren: () =>
      import('./views/rename-files/rename-files.route').then(
        (mod) => mod.RENAME_FILES_ROUTES
      ),
  },
  { path: '**', redirectTo: 'rename-files', pathMatch: 'full' },
];
