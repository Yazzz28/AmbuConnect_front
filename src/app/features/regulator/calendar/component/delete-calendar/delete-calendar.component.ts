import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CalendarFacadeService } from '../../service/calendar-facade.service';
import { CrossCancelComponent } from '../../../../../common/components/cross-cancel/cross-cancel.component';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-delete-calendar',
  imports: [CrossCancelComponent, Dialog],
  templateUrl: './delete-calendar.component.html',
  styleUrl: './delete-calendar.component.scss',
})
export class DeleteCalendarComponent {
  @Input() eventId!: string | undefined;
  calendarFacadeService = inject(CalendarFacadeService);
  @Output() visibleForm = new EventEmitter<boolean>();

  visible: boolean = false;

  showDialog(): void {
    this.visible = true;
  }

  closeDialog(): void {
    this.visible = false;
  }

  confirmDelete(): void {
    if (this.eventId) {
      this.calendarFacadeService.delete$(this.eventId).subscribe(() => {
        this.visibleForm.emit(false);
      });
    }
  }
}
