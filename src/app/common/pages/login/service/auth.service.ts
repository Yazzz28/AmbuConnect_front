import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequestType } from '../types/login-request.type';
import { environment } from '../../../../../environments/environment.development';
import { ActionDeleteItem } from '../../../../general/type/custom-type';

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _TOKEN_KEY = 'auth_token';
  private _isAuthenticatedSubject = new BehaviorSubject<boolean>(this._hasToken());
  private _http: HttpClient = inject(HttpClient);
  private _router: Router = inject(Router);
  private _baseUrl: string = environment.apiUrl;

  isAuthenticated$ = this._isAuthenticatedSubject.asObservable();
  login(credentials: LoginRequestType): Observable<ActionDeleteItem> {
    return this._http.post<{ token: string }>(`${this._baseUrl}/login`, credentials).pipe(
      tap(response => {
        this._setToken(response.token);
        this._isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this._TOKEN_KEY);
    this._isAuthenticatedSubject.next(false);
    this._router.navigate(['/authentification']);
  }

  getToken(): string | null {
    return localStorage.getItem(this._TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private _setToken(token: string): void {
    localStorage.setItem(this._TOKEN_KEY, token);
  }

  private _hasToken(): boolean {
    return !!this.getToken();
  }
}
