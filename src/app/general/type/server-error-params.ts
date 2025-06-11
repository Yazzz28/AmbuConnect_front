import { ActionDeleteItem } from './custom-type';

export type ServerErrorParams = {
  requiredLength?: number;
  hasUpperCase?: boolean;
  hasLowerCase?: boolean;
  hasNumber?: boolean;
  hasSpecialChar?: boolean;
  isValidLength?: boolean;
  requiredFormat?: string;
  message?: string;
  status?: number;
  error?: ActionDeleteItem;
};
