import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { Calendar } from '../model/calendar.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarHttpService {
  private _http = inject(HttpClient);
  private _baseUrl = environment.apiUrl;

  getCalendars$(): Observable<Calendar[]> {
    return this._http.get<Calendar[]>(`${this._baseUrl}/transports`);
  }

  getCalendarById$(calendarId: string): Observable<Calendar> {
    return this._http.get<Calendar>(`${this._baseUrl}/transports/${calendarId}`);
  }

  create$(calendar: Calendar): Observable<Calendar> {
    return this._http.post<Calendar>(`${this._baseUrl}/transports`, calendar);
  }

  update$(calendar: Calendar): Observable<Calendar> {
    return this._http.put<Calendar>(`${this._baseUrl}/transports/${calendar.id}`, calendar);
  }

  delete$(calendarId: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/transports/${calendarId}`);
  }
}
