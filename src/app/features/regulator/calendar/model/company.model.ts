import { Adress } from '../../../../common/shared/models/adress.model';

export type Company = {
  id: string;
  companyName: string;
  siret: string;
  adress: Adress;
};
