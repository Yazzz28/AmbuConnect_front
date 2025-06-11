export type FormFieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  isRequired: boolean;
  minLength?: number;
  type?: string;
  isNestedInPasswords?: boolean;
};

export const RESET_PASSWORD_FORM_FIELDS: FormFieldConfig[] = [
  { name: 'password', label: 'Mot de passe', placeholder: 'Mot de passe', isRequired: true, type: 'password', isNestedInPasswords: true },
  {
    name: 'confirmPassword',
    label: 'Confirmer le mot de passe',
    placeholder: 'Confirmer le mot de passe',
    isRequired: true,
    type: 'password',
    isNestedInPasswords: true,
  },
];
