import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Vehicle, VehicleTableDTO } from '../model/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleHttpService {
  private _http: HttpClient = inject(HttpClient);
  private _baseUrl: string = environment.apiUrl;

  getRegularVehicles$(): Observable<VehicleTableDTO[]> {
    return this._http.get<VehicleTableDTO[]>(`${this._baseUrl}/vehicles`);
  }

  getVehicleById$(vehicleId: string): Observable<Vehicle> {
    return this._http.get<Vehicle>(`${this._baseUrl}/vehicles/${vehicleId}`);
  }

  create$(vehicle: Vehicle): Observable<Vehicle> {
    return this._http.post<Vehicle>(`${this._baseUrl}/vehicles`, vehicle);
  }

  update$(vehicle: Vehicle): Observable<Vehicle> {
    return this._http.patch<Vehicle>(`${this._baseUrl}/vehicles/${vehicle.id}`, vehicle);
  }

  delete$(vehicleId: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/vehicles/${vehicleId}`);
  }
}
