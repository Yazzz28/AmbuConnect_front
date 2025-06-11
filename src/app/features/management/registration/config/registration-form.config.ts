export type FormFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  minLength?: number;
  type?: string;
  isNestedInPasswords?: boolean;
};

export const REGISTRATION_FORM_FIELDS: FormFieldConfig[] = [
  { name: 'firstname', label: 'Prénom', placeholder: 'Prénom', isRequired: true, minLength: 2 },
  { name: 'lastname', label: 'Nom', placeholder: 'Nom', isRequired: true, minLength: 2 },
  { name: 'email', label: 'Email', placeholder: 'Email', isRequired: true },
  { name: 'password', label: 'Mot de passe', placeholder: 'Mot de passe', isRequired: true, type: 'password', isNestedInPasswords: true },
  {
    name: 'confirmPassword',
    label: 'Confirmer le mot de passe',
    placeholder: 'Confirmer le mot de passe',
    isRequired: true,
    type: 'password',
    isNestedInPasswords: true,
  },
  { name: 'phone', label: 'Téléphone', placeholder: 'Téléphone (10 chiffres)', isRequired: false },
  { name: 'companyName', label: "Nom de l'entreprise", placeholder: "Nom de l'entreprise", isRequired: true },
  { name: 'adress', label: 'Rue', placeholder: 'Rue', isRequired: true, minLength: 2 },
  { name: 'additionnal', label: "Complément d'adresse", placeholder: "Complément d'adresse", isRequired: false },
  { name: 'city', label: 'Ville', placeholder: 'Ville', isRequired: true },
  { name: 'zipCode', label: 'Code postal', placeholder: 'Code postal', isRequired: true },
  { name: 'siret', label: 'Siret', placeholder: 'Siret (14 chiffres)', isRequired: false },
];
