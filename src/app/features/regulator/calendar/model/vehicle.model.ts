import { Company } from './company.model';

export type Vehicle = {
  id: string;
  registration: string;
  type: string;
  color: string;
  company: Company;
};
