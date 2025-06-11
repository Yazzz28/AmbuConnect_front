export type User = {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  degree: string;
  degreeExpirationDate: Date;
  profession?: string[];
  password: string;
  roles?: string[];
};

export type UserTableDTO = {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  degree: string;
  degreeExpirationDate: Date;
  profession?: string[];
  password: string;
  roles?: string[];
};
