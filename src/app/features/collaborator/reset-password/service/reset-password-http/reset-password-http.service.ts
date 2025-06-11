import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment.development';
import { ResetPasswordDTO } from '../../reset-passwordDTO';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordHttpService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly _baseUrl: string = environment.apiUrl;

  post$(resetPasswordDTO: ResetPasswordDTO & { token: string }): Observable<unknown> {
    return this._http
      .post<unknown>(`${this._baseUrl}/password/reset`, resetPasswordDTO)
      .pipe(catchError(this.handleError('Erreur lors de la réinitialisation du mot de passe')));
  }

  getUserInfoByToken(token: string): Observable<{ firstName: string; lastName: string }> {
    return this._http
      .get<{ firstName: string; lastName: string }>(`${this._baseUrl}/password/user-info`, { params: { token } })
      .pipe(catchError(this.handleError('Erreur lors de la récupération des informations utilisateur')));
  }

  handleError(defaultMessage: string): (error: HttpErrorResponse) => Observable<never> {
    return (error: HttpErrorResponse) => {
      return throwError(() => ({
        error: error.error,
        status: error.status,
        message: error.error?.message || defaultMessage,
      }));
    };
  }
}
