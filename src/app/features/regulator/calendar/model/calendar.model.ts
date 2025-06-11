import { Patient } from '../../directory/model/patient.model';
import { Vehicle } from './vehicle.model';

export type Calendar = {
  id: string;
  startAt: string;
  startPlace: string;
  endAt: string;
  endPlace: string;
  type: string;
  contactName: string;
  contactPhone: string;
  emergencyCode: string;
  note: string;
  patients: Patient[];
  vehicle: Vehicle;
  isEmergency: boolean;
};
