import { FieldOption } from '../../form/form-field/form-field.component';

export type FieldConfig = {
  field: string;
  type?: string;
  label?: string;
  required?: boolean;
  options?: FieldOption[];
  variant?: 'customCheckbox';
};
