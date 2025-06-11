import { Injectable } from '@angular/core';
import { Calendar } from '../model/calendar.model';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarStoreService {
  private _calendars$: BehaviorSubject<Calendar[]> = new BehaviorSubject<Calendar[]>([]);

  setAll$(calendars: Calendar[]): Observable<Calendar[]> {
    this._calendars$.next(calendars);
    return this._calendars$.asObservable();
  }

  create$(calendar: Calendar): void {
    this._calendars$.next([...this._calendars$.value, calendar]);
  }

  update$(calendar: Calendar): Observable<Calendar> {
    return of(calendar).pipe(
      tap(c => {
        const updated = this._calendars$.value.map(x => (x.id === c.id ? c : x));
        this._calendars$.next(updated);
      })
    );
  }

  delete$(calendarId: string): void {
    const updatedCalendars = this._calendars$.value.filter(calendar => calendar.id !== calendarId);
    this._calendars$.next(updatedCalendars);
  }
}
