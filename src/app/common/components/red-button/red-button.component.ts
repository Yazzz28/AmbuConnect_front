import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-red-button',
  imports: [],
  templateUrl: './red-button.component.html',
  styleUrl: './red-button.component.scss',
})
export class RedButtonComponent {
  @Input() name: string = '';
  @Input() type: string = 'submit';
  @Input() customClass: string = 'sm:justify-start';
}
