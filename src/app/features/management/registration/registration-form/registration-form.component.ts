import { Component, EventEmitter, inject, OnDestroy, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistrationDTO } from '../registrationDTO';
import { RegistrationHttpService } from '../service/registration-http/registration-http.service';
import { Router } from '@angular/router';
import { ErrorMessageService } from '../service/error-message/error-message.service';
import { FormFieldComponent } from '../../../../common/components/form/form-field/form-field.component';
import { DarkBlueButtonComponent } from '../../../../common/components/dark-blue-button/dark-blue-button.component';
import { FormFieldConfig, REGISTRATION_FORM_FIELDS } from '../config/registration-form.config';
import { catchError, Subject, takeUntil, throwError } from 'rxjs';
import { RegisterUser } from '../class/register-user.class';

const MIN_LENGTH = 2;

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormFieldComponent, DarkBlueButtonComponent],
})
export class RegistrationFormComponent implements OnDestroy {
  @Output() formSubmitted: EventEmitter<RegistrationDTO> = new EventEmitter<RegistrationDTO>();
  signUpForm!: FormGroup;
  isSubmitted: boolean = false;
  serverErrors: Record<string, string> = {};
  formFields: FormFieldConfig[] = REGISTRATION_FORM_FIELDS;
  private _formBuilder: FormBuilder = inject(FormBuilder);
  private _errorService: ErrorMessageService = inject(ErrorMessageService);
  private _registrationService: RegistrationHttpService = inject(RegistrationHttpService);
  private _router: Router = inject(Router);
  private _destroy$: Subject<void> = new Subject<void>();

  constructor() {
    this.signUpForm = this._formBuilder.group({
      firstname: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH)]),
      email: new FormControl('', [Validators.required, RegisterUser.emailValidator()]),
      adress: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH)]),
      additional: new FormControl(''),
      passwords: this._formBuilder.group(
        {
          password: new FormControl('', [Validators.required, RegisterUser.securePassword()]),
          confirmPassword: new FormControl('', Validators.required),
        },
        { validators: RegisterUser.passwordMatch() }
      ),
      city: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, RegisterUser.zipCodeValidator()]),
      phone: new FormControl('', [RegisterUser.phoneNumberValidator()]),
      siret: new FormControl('', [RegisterUser.siretNumberValidator()]),
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.serverErrors = {};

    if (this.signUpForm.valid) {
      const user: RegisterUser = RegisterUser.fromFormData(this.signUpForm.value);
      const registrationDTO: RegistrationDTO = user.toDTO();

      this._registrationService
        .post$(registrationDTO)
        .pipe(
          takeUntil(this._destroy$),
          catchError(error => {
            this.serverErrors = this._errorService.handleServerErrors(error, this.signUpForm);
            return throwError(() => error);
          })
        )
        .subscribe(() => {
          this._router.navigate(['/']);
        });
    }
  }

  getControl(fieldName: string, isNestedInPasswords?: boolean): AbstractControl | null {
    if (isNestedInPasswords) {
      return this.signUpForm.get(`passwords.${fieldName}`);
    }
    return this.signUpForm.get(fieldName);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
