import { Pipe, PipeTransform } from '@angular/core';
import { ActionDeleteItem } from '../../../../general/type/custom-type';

@Pipe({
  name: 'displayFields',
  standalone: true,
})
export class DisplayFieldsPipe implements PipeTransform {
  transform(item: ActionDeleteItem, firstTitle: string, secondTitle?: string, separator: string = ' | '): string {
    if (!item) return '';

    const primaryValue: ActionDeleteItem = item[firstTitle] || '';

    if (secondTitle && item[secondTitle]) {
      return `${primaryValue}${separator}${item[secondTitle]}`;
    }

    return primaryValue;
  }
}
