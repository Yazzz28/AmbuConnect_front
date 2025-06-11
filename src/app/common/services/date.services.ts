import { Injectable } from '@angular/core';

const NUM_MAX = 10;
const MONTH = 1;

@Injectable({
  providedIn: 'root',
})
export class DateServices {
  public formatDateFr(dateStr: string): string {
    if (!dateStr) {
      return '';
    }

    const date = new Date(dateStr);
    const pad = (num: number): string => (num < NUM_MAX ? '0' + num : String(num));

    const day: string = pad(date.getDate());
    const month: string = pad(date.getMonth() + MONTH);
    const year: number = date.getFullYear();
    const hours: string = pad(date.getHours());
    const minutes: string = pad(date.getMinutes());

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
