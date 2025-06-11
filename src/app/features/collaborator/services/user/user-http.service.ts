import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { User, UserTableDTO } from '../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  private _http = inject(HttpClient);
  private _baseUrl: string = environment.apiUrl;

  getUsers$(): Observable<UserTableDTO[]> {
    return this._http.get<UserTableDTO[]>(`${this._baseUrl}/users`);
  }

  getUserById$(userId: number): Observable<User> {
    return this._http.get<User>(`${this._baseUrl}/users/${userId}`);
  }

  create$(user: User): Observable<User> {
    return this._http.post<User>(`${this._baseUrl}/users`, user);
  }

  update$(user: User): Observable<User> {
    return this._http.put<User>(`${this._baseUrl}/users/${user.id}`, user);
  }

  delete$(userId: number): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/users/${userId}`);
  }
}
