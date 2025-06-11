import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VehicleTableDTO } from '../model/vehicle.model';

@Injectable({
  providedIn: 'root',
})
export class VehicleStoreService {
  private _vehicles$: BehaviorSubject<VehicleTableDTO[]> = new BehaviorSubject<VehicleTableDTO[]>([]);

  setAll$(vehicles: VehicleTableDTO[]): Observable<VehicleTableDTO[]> {
    this._vehicles$.next(vehicles);
    return this._vehicles$.asObservable();
  }

  create$(vehicle: VehicleTableDTO): void {
    this._vehicles$.next([...this._vehicles$.value, vehicle]);
  }

  update$(vehicle: VehicleTableDTO): void {
    const updatedVehicles: VehicleTableDTO[] = this._vehicles$.value.map(p => (p.id === vehicle.id ? vehicle : p));
    this._vehicles$.next(updatedVehicles);
  }

  delete$(vehicleId: string): void {
    const updatedVehicles: VehicleTableDTO[] = this._vehicles$.value.filter(vehicle => vehicle.id !== vehicleId);
    this._vehicles$.next(updatedVehicles);
  }
}
