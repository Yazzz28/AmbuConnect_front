import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserTableDTO } from '../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserSanitizeService {
  sanitizePhone(users: Observable<UserTableDTO[]>): Observable<UserTableDTO[]> {
    return users.pipe(
      map(userArray =>
        userArray.map(user => ({
          ...user,
          phone: this._formatPhone(user.phone),
        }))
      )
    );
  }

  private _formatPhone(phone?: string): string {
    if (!phone) return '';

    let formattedPhone = phone.replace(/^\+33/, '0');
    formattedPhone = formattedPhone.replace(/\D/g, '');
    return formattedPhone.replace(/(\d{2})(?=\d)/g, '$1.');
  }
}
