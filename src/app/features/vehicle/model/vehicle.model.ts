import { TypeOfVehicle } from '../type/type-of-vehicle';

export type Vehicle = {
  id: string;
  registration: string;
  authorizationNumber: number;
  typeOf: TypeOfVehicle;
  color: string;
  technicalInspectionEndDate: Date;
};

export type VehicleTableDTO = {
  id: string | void;
  registration: string;
  authorizationNumber: number;
  typeOf: string;
  color: string;
  technicalInspectionEndDate: Date;
};
