import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../service/auth.service';

const SINGLE_EMISSION = 1;

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _authService: AuthService = inject(AuthService);
  private _router: Router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> {
    return this._authService.isAuthenticated$.pipe(
      take(SINGLE_EMISSION),
      map(isAuthenticated => (isAuthenticated ? true : this._router.createUrlTree(['/authentification'])))
    );
  }
}
