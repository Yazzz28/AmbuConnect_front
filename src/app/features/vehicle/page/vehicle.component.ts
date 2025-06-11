import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TableComponent } from '../../../common/components/table/table.component';
import { Column } from '../../../common/shared/models/column.model';
import { Observable } from 'rxjs';
import { VehicleFacadeService } from '../service/vehicle-facade.service';
import { VehicleTableDTO } from '../model/vehicle.model';

@Component({
  selector: 'app-vehicle',
  imports: [AsyncPipe, TableComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {
  readonly vehiclesFacadeService: VehicleFacadeService = inject(VehicleFacadeService);

  columns: Column[] = [
    { field: 'registration', header: 'Immatriculation' },
    { field: 'technicalInspectionEndDate', header: 'Date du contrôle technique' },
    { field: 'typeOf', header: 'Type de véhicule' },
  ];

  form = [
    { field: 'registration', label: 'Immatriculation', type: 'text', required: true },
    {
      field: 'typeOf',
      label: 'Type de véhicule',
      type: 'single-select',
      required: true,
      options: [
        { label: 'Ambulance', value: 'AMBULANCE' },
        { label: 'VSL', value: 'VSL' },
      ],
    },
    { field: 'technicalInspectionEndDate', label: 'Date contrôle technique', type: 'date', required: true },
    { field: 'color', label: 'Couleur', type: 'color', required: true },
  ];

  mainFieldsConfig: string[] = ['id', 'registration', 'authorizationNumber', 'typeOf', 'color', 'technicalInspectionEndDate'];

  globalFilterFields: string[] = ['registration', 'authorizationNumber', 'typeOf', 'technicalInspectionEndDate'];

  fieldToShow: string = 'typeOfVehicle';
  fieldToShowTwo: string = 'registration';
  data$: Observable<VehicleTableDTO[]> = this.vehiclesFacadeService.getAll$();
}
