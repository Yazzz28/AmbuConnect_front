import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationFormComponent } from '../registration-form/registration-form.component';
import { RegistrationHttpService } from '../service/registration-http/registration-http.service';
import { Router } from '@angular/router';
import { RegistrationDTO } from '../registrationDTO';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [ReactiveFormsModule, RegistrationFormComponent],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
})
export class RegistrationPageComponent implements OnDestroy {
  private _registrationHttpService: RegistrationHttpService = inject(RegistrationHttpService);
  private _router: Router = inject(Router);
  private _destroy$: Subject<void> = new Subject<void>();

  onFormSubmitted(formData: RegistrationDTO): void {
    this._registrationHttpService
      .post$(formData)
      .pipe(
        takeUntil(this._destroy$),
        catchError(error => {
          return throwError(() => error);
        })
      )
      .subscribe(() => {
        this._router.navigate(['/']);
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
