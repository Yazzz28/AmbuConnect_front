import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CalendarOptions, EventDropArg, EventSourceInput } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CalendarFacadeService } from '../../service/calendar-facade.service';
import { ConvertEntityToCalendarService } from '../../service/convert-entity-to-calendar.service';
import { EventResizeDoneArg } from '@fullcalendar/interaction';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getCalendarOptions } from '../../config/calendar-options.config';
import { Calendar } from '../../model/calendar.model';
import { AsyncPipe } from '@angular/common';
import { NewCalendarComponent } from '../../component/new-calendar/new-calendar.component';
import { ActionDeleteItem } from '../../../../../general/type/custom-type';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [FullCalendarModule, FormsModule, ReactiveFormsModule, AsyncPipe, NewCalendarComponent],
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
})
export class CalendarPageComponent implements OnInit {
  events$: Observable<EventSourceInput> | undefined;
  calendarOptions: CalendarOptions;
  selectedEvent: Calendar | undefined;
  visible = false;
  private readonly _destroyRef = inject(DestroyRef);
  private _calendarFacadeService = inject(CalendarFacadeService);
  private _convertEntityToCalendarService = inject(ConvertEntityToCalendarService);
  constructor() {
    this.calendarOptions = getCalendarOptions(
      () => this.showDialog(),
      (info: EventDropArg | EventResizeDoneArg) => this.updateEventDate(info),
      (info: ActionDeleteItem) => {
        const id = info.event.id;
        this._calendarFacadeService.getById$(id).subscribe(event => {
          this.showDialog(event);
        });
      }
    );
  }

  ngOnInit(): void {
    const data$ = this._calendarFacadeService.getAll$();
    this.events$ = this._convertEntityToCalendarService.convertDataToCalendarEvents(data$);
  }

  showDialog(event?: Calendar): void {
    this.selectedEvent = event;
    this.visible = true;
  }

  handleSave(event: Calendar): void {
    if (event.id) {
      this._calendarFacadeService.update$(event).pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe();
    } else {
      this._calendarFacadeService.create$(event);
    }
  }

  updateEventDate(info: EventDropArg | EventResizeDoneArg): void {
    const eventId = info.event.id;
    const newStart = info.event.start;
    const newEnd = info.event.end;
    if (!newStart || !newEnd || newStart >= newEnd) {
      info.revert();
      return;
    }
    this._calendarFacadeService.getById$(eventId).subscribe({
      next: calendarEvent => {
        const updatedCalendar: Calendar = {
          ...calendarEvent,
          startAt: newStart.toISOString(),
          endAt: newEnd.toISOString(),
        };
        this._calendarFacadeService.update$(updatedCalendar).subscribe({
          error: () => info.revert(),
        });
      },
      error: () => info.revert(),
    });
  }
}
