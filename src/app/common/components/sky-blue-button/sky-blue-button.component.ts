import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sky-blue-button',
  imports: [],
  templateUrl: './sky-blue-button.component.html',
  styleUrl: './sky-blue-button.component.scss',
})
export class SkyBlueButtonComponent {
  @Input() name: string = '';
  @Input() type: string = 'submit';
  @Input() customClass: string = 'sm:justify-start';
}
