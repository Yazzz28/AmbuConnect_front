import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { RegistrationDTO } from '../../registrationDTO';
import { environment } from '../../../../../../environments/environment.development';
import { ActionDeleteItem } from '../../../../../general/type/custom-type';

@Injectable({
  providedIn: 'root',
})
export class RegistrationHttpService {
  private _http: HttpClient = inject(HttpClient);
  private _baseUrl: string = environment.apiUrl;

  post$(registrationDTO: RegistrationDTO): Observable<ActionDeleteItem> {
    return this._http.post<ActionDeleteItem>(`${this._baseUrl}/loginn`, registrationDTO).pipe(
      catchError(error => {
        return throwError(() => ({
          error: error.error,
          status: error.status,
          message: error.error.message,
        }));
      })
    );
  }
}
