import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-action-delete',
  standalone: true,
  imports: [Button, Dialog],
  templateUrl: './action-delete.component.html',
  styleUrl: './action-delete.component.scss',
})
export class ActionDeleteComponent {
  @Input() item!: any;
  @Input() fieldToShow: string = '';
  @Input() fieldToShowTwo?: string = '';
  @Input() facadeService!: any;

  visible = false;

  showDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  confirmDelete(): void {
    if (this.facadeService && this.item?.id) {
      this.facadeService.delete$(this.item.id);
      this.closeDialog();
    }
  }
}
