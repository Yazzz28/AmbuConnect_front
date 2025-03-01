import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { NgClass } from '@angular/common';
import { SwitchDarkModeComponent } from '../general/switch-dark-mode/switch-dark-mode.component';

@Component({
  selector: 'app-nav-bar',
  imports: [MenubarModule, RouterLink, NgClass, SwitchDarkModeComponent],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  items: MenuItem[] | undefined;
  logo = ' assets/logo.svg';

  ngOnInit(): void {
    this.items = [
      {
        label: 'logo',
        src: this.logo,
      },
      {
        label: 'Acceuil',
        icon: 'pi pi-fw pi-home text-text',
        routerLink: '/',
        styleClass: 'text-text items-center',
      },
      {
        label: 'Gestion',
        icon: 'pi pi-fw pi-cog text-text',
        styleClass: 'text-text items-center',
        items: [
          {
            label: 'Gestion des employés',
            icon: 'pi pi-fw pi-user text-text',
            routerLink: '/gestion-employes',
            styleClass: 'text-text',
          },
          {
            label: 'Gestion des véhicules',
            icon: 'pi pi-fw pi-car text-text',
            routerLink: '/gestion-vehicules',
            styleClass: 'text-text',
          },
        ],
      },
      {
        label: 'Régulation',
        icon: 'pi pi-fw pi-calendar text-text',
        styleClass: 'text-text items-center',
        items: [
          {
            label: 'Calendrier',
            icon: 'pi pi-fw pi-calendar text-text',
            routerLink: '/calendrier',
            styleClass: 'text-text',
          },
          {
            label: 'Répertoire patient',
            icon: 'pi pi-fw pi-phone text-text',
            routerLink: '/page-patient',
            styleClass: 'text-text',
          },
        ],
      },
      {
        label: 'Transports',
        icon: 'pi pi-fw pi-truck text-text',
        routerLink: '/transports',
        styleClass: 'text-text items-center',
      },
      {
        label: 'Gestion Administrative',
        icon: 'pi pi-fw pi-shield text-text',
        routerLink: '/gestion-administrative',
        styleClass: 'text-text',
      },
      {
        label: 'Se connecter',
        icon: 'pi pi-fw pi-user text-white',
        styleClass: 'text-white items-center bg-mainButton rounded-md',
      },
    ];
  }
}
