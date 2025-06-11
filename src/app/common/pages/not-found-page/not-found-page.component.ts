import { Component } from '@angular/core';
import { DarkBlueButtonComponent } from '../../components/dark-blue-button/dark-blue-button.component';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [DarkBlueButtonComponent],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {}
