import { Component, inject, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dark-blue-button',
  imports: [NgClass],
  templateUrl: './dark-blue-button.component.html',
  styleUrl: './dark-blue-button.component.scss',
})
export class DarkBlueButtonComponent {
  @Input() name: string = '';
  @Input() type: string = 'submit';
  @Input() customClass: string = 'sm:justify-start';
  @Input() routerLink: string | null = null;
  private _router: Router = inject(Router);

  onClick(): void {
    if (this.routerLink) {
      this._router.navigate([this.routerLink]);
    }
  }
}
