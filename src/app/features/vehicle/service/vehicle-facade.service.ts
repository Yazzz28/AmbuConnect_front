import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { VehicleStoreService } from './vehicle-store.service';
import { Vehicle, VehicleTableDTO } from '../model/vehicle.model';
import { VehicleHttpService } from './vehicle-http.service';

@Injectable({
  providedIn: 'root',
})
export class VehicleFacadeService {
  private _vehicleHttpService: VehicleHttpService = inject(VehicleHttpService);
  private _vehicleStoreService: VehicleStoreService = inject(VehicleStoreService);

  getAll$(): Observable<VehicleTableDTO[]> {
    return this._vehicleHttpService.getRegularVehicles$().pipe(switchMap(vehicles => this._vehicleStoreService.setAll$(vehicles)));
  }

  getById$(vehicleId: string): Observable<Vehicle> {
    return this._vehicleHttpService.getVehicleById$(vehicleId);
  }

  create$(vehicle: Vehicle): Observable<Vehicle> {
    return this._vehicleHttpService.create$(vehicle).pipe(
      tap((createdVehicle: Vehicle) => {
        const vehicleTableDTO: VehicleTableDTO = this._convertVehicleToVehicleTableDTO(createdVehicle);
        this._vehicleStoreService.create$(vehicleTableDTO);
      })
    );
  }

  update$(vehicle: Vehicle): Observable<Vehicle> {
    return this._vehicleHttpService.update$(vehicle).pipe(
      tap((updatedVehicle: Vehicle) => {
        const vehicleTableDTO: VehicleTableDTO = this._convertVehicleToVehicleTableDTO(updatedVehicle);
        this._vehicleStoreService.update$(vehicleTableDTO);
      })
    );
  }

  delete$(vehicleId: string): Observable<void> {
    return this._vehicleHttpService.delete$(vehicleId).pipe(tap(() => this._vehicleStoreService.delete$(vehicleId)));
  }

  private _convertVehicleToVehicleTableDTO(vehicle: Vehicle): VehicleTableDTO {
    return {
      id: vehicle.id,
      registration: vehicle.registration,
      authorizationNumber: vehicle.authorizationNumber,
      typeOf: vehicle.typeOf,
      color: vehicle.color,
      technicalInspectionEndDate: vehicle.technicalInspectionEndDate,
    };
  }
}
