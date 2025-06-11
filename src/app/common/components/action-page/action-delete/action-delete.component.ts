import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DisplayFieldsPipe } from '../pipe/display-fields.pipe';
import { RedButtonComponent } from '../../red-button/red-button.component';
import { ActionDeleteItem } from '../../../../general/type/custom-type';

@Component({
  selector: 'app-action-delete',
  standalone: true,
  imports: [Button, Dialog, DisplayFieldsPipe, RedButtonComponent],
  templateUrl: './action-delete.component.html',
  styleUrl: './action-delete.component.scss',
})
export class ActionDeleteComponent {
  @Input() item!: ActionDeleteItem;
  @Input() firstTitle: string = '';
  @Input() secondTitle?: string = '';
  @Input() facadeService!: ActionDeleteItem;
  @Input() separator: string = ' | ';

  visible: boolean = false;

  showDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  confirmDelete(): void {
    if (!this.facadeService || !this.item?.id) {
      return;
    }

    this.facadeService.delete$(this.item.id).subscribe({
      next: () => {
        this.closeDialog();
      },
      error: (err: ActionDeleteItem) => {
        console.error('Erreur lors de la suppression:', err);
      },
    });
  }
}
