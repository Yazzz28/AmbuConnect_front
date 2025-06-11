import { inject, Injectable } from '@angular/core';
import { CalendarHttpService } from './calendar-http.service';
import { CalendarStoreService } from './calendar-store.service';
import { Observable, switchMap, take, tap } from 'rxjs';
import { Calendar } from '../model/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarFacadeService {
  private _calendarService: CalendarHttpService = inject(CalendarHttpService);
  private _calendarStoreService: CalendarStoreService = inject(CalendarStoreService);

  getAll$(): Observable<Calendar[]> {
    return this._calendarService.getCalendars$().pipe(switchMap(calendars => this._calendarStoreService.setAll$(calendars)));
  }

  getById$(calendarId: string): Observable<Calendar> {
    return this._calendarService.getCalendarById$(calendarId);
  }

  create$(calendar: Calendar): void {
    this._calendarService
      .create$(calendar)
      .pipe(
        take(1),
        tap((createdCalendar: Calendar) => this._calendarStoreService.create$(createdCalendar))
      )
      .subscribe();
  }

  update$(calendar: Calendar): Observable<Calendar> {
    return this._calendarService
      .update$(calendar)
      .pipe(switchMap(() => this._calendarStoreService.update$(calendar).pipe(switchMap(() => [calendar]))));
  }

  delete$(calendarId: string): Observable<void> {
    return this._calendarService.delete$(calendarId).pipe(tap(() => this._calendarStoreService.delete$(calendarId)));
  }
}
