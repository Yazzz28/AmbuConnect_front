import { Routes } from '@angular/router';
import { HomePageComponent } from './common/pages/home-page/home-page.component';
import { RegistrationPageComponent } from './features/management/registration/registration-page/registration-page.component';
import { DirectoryComponent } from './features/regulator/directory/page/directory.component';
import { CalendarPageComponent } from './features/regulator/calendar/page/page/calendar-page.component';
import { LoginPageComponent } from './common/pages/login/login-page/login-page.component';
import { AuthGuard } from './common/pages/login/guard/guard';
import { VehicleComponent } from './features/vehicle/page/vehicle.component';
import { CollaboratorPageComponent } from './features/collaborator/collaborator-page/collaborator-page.component';
import { ResetPasswordPageComponent } from './features/collaborator/reset-password/reset-password-page/reset-password-page.component';
import { NotFoundPageComponent } from './common/pages/not-found-page/not-found-page.component';
import { TransporterPageComponent } from './features/transporter/page/transporter-page/transporter-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'page-patient',
    component: DirectoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'calendar',
    component: CalendarPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'inscription',
    component: RegistrationPageComponent,
  },
  {
    path: 'authentification',
    component: LoginPageComponent,
  },
  {
    path: 'gestion-employes',
    component: CollaboratorPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gestion-vehicules',
    component: VehicleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reinitialisation-password',
    component: ResetPasswordPageComponent,
  },
  {
    path: 'transports',
    component: TransporterPageComponent,
  },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '**', redirectTo: '/not-found' },
];
