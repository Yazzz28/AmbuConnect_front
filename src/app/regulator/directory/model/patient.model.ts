import { Adress } from '../../../general/type/adress.model';

export type Patient = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  hasOxygene: boolean;
  isRegular: boolean;
  note: string;
  address: Adress;
};

export type PatientTableDTO = {
  id: string;
  firstname: string;
  lastname: string;
  isRegular: boolean;
  phone: string;
  addressString: string;
};
