import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarViewDTO } from '../transport.interface';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TransporterHttpService {
  private _baseUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getAllTransports(): Observable<CalendarViewDTO[]> {
    return this._http.get<CalendarViewDTO[]>(`${this._baseUrl}/transports`);
  }

  getTransportById(id: number): Observable<CalendarViewDTO> {
    return this._http.get<CalendarViewDTO>(`${this._baseUrl}/transports/${id}`);
  }

  getTransportsByVehicleId(vehicleId: number): Observable<CalendarViewDTO[]> {
    return this._http.get<CalendarViewDTO[]>(`${this._baseUrl}/transports/vehicle/${vehicleId}`);
  }

  updateTransport(id: number, transport: CalendarViewDTO): Observable<CalendarViewDTO> {
    return this._http.put<CalendarViewDTO>(`${this._baseUrl}/transports/${id}`, transport);
  }
}
