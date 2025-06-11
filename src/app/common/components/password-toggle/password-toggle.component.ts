import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../shared/svg-icon/svg-icon.component';

@Component({
  selector: 'app-password-toggle',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './password-toggle.component.html',
  styleUrls: ['./password-toggle.component.scss'],
})
export class PasswordToggleComponent {
  @Input() visible: boolean = false;
  @Output() visibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  eyeOpenSvg: string = '<i class="pi pi-eye"></i>';
  eyeClosedSvg: string = '<i class="pi pi-eye-slash"></i>';

  togglePasswordVisibility(): void {
    this.visibilityChange.emit(!this.visible);
  }
}
