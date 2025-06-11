import { Component, inject } from '@angular/core';
import Aura from '@primeng/themes/aura';
import { PrimeNG } from 'primeng/config';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from './common/components/nav-bar/nav-bar.component';
import { FooterComponent } from './common/components/footer/footer.component';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBarComponent, FooterComponent, Toast],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private _primeNg: PrimeNG;
  private _router: Router = inject(Router);
  showNavbar: boolean = true;

  constructor(primeNg: PrimeNG) {
    this._primeNg = primeNg;
    this._primeNg.theme.set({
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primeng',
          order: 'tailwind-base, primeng, tailwind-utilities',
        },
      },
    });
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const hiddenRoutes: string[] = ['/not-found'];
        this.showNavbar = !hiddenRoutes.includes(this._router.url);
      }
    });
  }
}
