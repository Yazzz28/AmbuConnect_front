export type RegistrationDTO = {
  email: string;
  password: string;
  confirmPassword: string;
  firstname: string;
  lastname: string;
  phone?: string;
  degree?: string;
  degree_expiration_date?: Date;
  companyName: string;
  siret?: string;
  adress: string;
  additionnal?: string;
  city: string;
  zipCode: string;
};
