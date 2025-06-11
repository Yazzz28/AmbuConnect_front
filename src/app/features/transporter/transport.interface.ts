export type PatientEditDTO = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  hasOxygen: boolean;
  isRegular: boolean;
  note: string;
  adress: string;
};

export type VehicleCalendarDTO = {
  id: number;
  registration: string;
  authorizationNumber: string;
  typeOfVehicle: string;
  color: string;
};

export type CalendarViewDTO = {
  id: number;
  startAt: string;
  startPlace: string;
  endAt: string;
  endPlace: string;
  type: string;
  contactName: string;
  contactPhone: string;
  isEmergency: boolean;
  emergencyCode: string;
  note: string;
  patients: PatientEditDTO[];
  vehicle: VehicleCalendarDTO;
};

export type TransportState = {
  transports: CalendarViewDTO[];
  loading: boolean;
  error: string | null;
  selectedTransport: CalendarViewDTO | null;
};
