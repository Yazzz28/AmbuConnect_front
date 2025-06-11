import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserTableDTO } from '../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private readonly _users$ = new BehaviorSubject<UserTableDTO[]>([]);

  setAll$(users: UserTableDTO[]): Observable<UserTableDTO[]> {
    this._users$.next(users);
    return this._users$.asObservable();
  }

  getAll$(): Observable<UserTableDTO[]> {
    return this._users$.asObservable();
  }

  create$(user: UserTableDTO): Observable<UserTableDTO[]> {
    const updatedUsers = [...this._users$.value, user];
    this._users$.next(updatedUsers);
    return this._users$.asObservable();
  }

  update$(user: UserTableDTO): void {
    const updatedUsers = this._users$.value.map(p => (p.id === user.id ? user : p));
    this._users$.next(updatedUsers);
  }

  delete$(userId: number): void {
    const updatedUsers = this._users$.value.filter(user => user.id !== userId);
    this._users$.next(updatedUsers);
  }
}
