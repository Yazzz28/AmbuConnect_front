import { ActionDeleteItem } from '../../../general/type/custom-type';

export type Column = {
  field: string;
  header: string;
  type?: 'array' | 'object';
  displayField?: string;
  formatter?: (value: ActionDeleteItem) => string;
};
