import { Routes } from '@angular/router';
import { HomePageComponent } from './component/home-page/home-page.component';
import { DirectoryComponent } from './regulator/directory/page/directory.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'page-patient',
    component: DirectoryComponent,
  },
];
