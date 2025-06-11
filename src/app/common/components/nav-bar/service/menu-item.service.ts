import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../pages/login/service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class MenuItemsService {
  constructor(private _authService: AuthService) {}

  getMenuItems(logo: string, logoutCallback: () => void): MenuItem[] {
    const baseItems: MenuItem[] = [
      {
        label: 'Accueil',
        icon: 'pi pi-fw pi-home text-textNavbar',
        routerLink: '/',
        styleClass: 'text-textNavbar items-center px-2',
      },
      {
        label: 'Gestion',
        icon: 'pi pi-fw pi-cog text-textNavbar',
        styleClass: 'text-textNavbar items-center px-2',
        items: [
          {
            label: 'Gestion des employés',
            icon: 'pi pi-fw pi-user text-textNavbar',
            routerLink: '/gestion-employes',
            styleClass: 'text-textNavbar items-center px-2',
          },
          {
            label: 'Gestion des véhicules',
            icon: 'pi pi-fw pi-car text-textNavbar',
            routerLink: '/gestion-vehicules',
            styleClass: 'text-textNavbar items-center px-2',
          },
        ],
      },
      {
        label: 'Régulation',
        icon: 'pi pi-fw pi-calendar text-textNavbar',
        styleClass: 'text-textNavbar items-center px-2',
        items: [
          {
            label: 'Calendrier',
            icon: 'pi pi-fw pi-calendar text-textNavbar',
            routerLink: '/calendar',
            styleClass: 'text-textNavbar ',
          },
          {
            label: 'Répertoire patient',
            icon: 'pi pi-fw pi-phone text-textNavbar',
            routerLink: '/page-patient',
            styleClass: 'text-textNavbar',
          },
        ],
      },
      {
        label: 'Transports',
        icon: 'pi pi-fw pi-truck text-textNavbar',
        routerLink: '/transports',
        styleClass: 'items-center px-2 text-textNavbar',
      },
    ];

    if (this._authService.isAuthenticated()) {
      baseItems.push({
        label: 'Se déconnecter',
        icon: 'pi pi-fw pi-sign-out',
        command: logoutCallback,
        styleClass: 'items-center rounded-md border-none bg-mainButton',
      });
    } else {
      baseItems.push({
        label: 'Se connecter',
        routerLink: '/authentification',
        icon: 'pi pi-fw pi-user ',
        styleClass: 'items-center rounded-md border-none bg-mainButton',
      });
    }

    return baseItems;
  }
}
