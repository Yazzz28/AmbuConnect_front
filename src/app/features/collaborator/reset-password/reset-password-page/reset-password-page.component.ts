import { Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, Subject, takeUntil, throwError } from 'rxjs';
import { DarkBlueButtonComponent } from '../../../../common/components/dark-blue-button/dark-blue-button.component';
import { FormFieldComponent } from '../../../../common/components/form/form-field/form-field.component';
import { ResetPasswordDTO } from '../reset-passwordDTO';
import { ResetPasswordHttpService } from '../service/reset-password-http/reset-password-http.service';
import { FormFieldConfig, RESET_PASSWORD_FORM_FIELDS } from '../config/reset-password-form.config';
import { ErrorMessageService } from '../service/error-message/error-message.service';
import { ResetPassword } from '../class/reset-password.class';
import { ActionDeleteItem } from '../../../../general/type/custom-type';

const TIME = 3000;

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [DarkBlueButtonComponent, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
})
export class ResetPasswordPageComponent implements OnInit, OnDestroy {
  @Output() formSubmitted: EventEmitter<ResetPasswordDTO> = new EventEmitter<ResetPasswordDTO>();

  signUpForm!: FormGroup;
  isSubmitted: boolean = false;
  serverErrors: Record<string, string> = {};
  formFields: FormFieldConfig[] = RESET_PASSWORD_FORM_FIELDS;
  token: string = '';
  firstName: string = '';
  lastName: string = '';
  isLoading: boolean = true;
  resetSuccess: boolean = false;

  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _errorService: ErrorMessageService = inject(ErrorMessageService);
  private readonly _resetPasswordService: ResetPasswordHttpService = inject(ResetPasswordHttpService);
  private readonly _router: Router = inject(Router);
  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _destroy$: Subject<void> = new Subject<void>();

  constructor() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.signUpForm = this._formBuilder.group({
      passwords: this._formBuilder.group(
        {
          password: new FormControl('', [Validators.required, ResetPassword.securePassword()]),
          confirmPassword: new FormControl('', Validators.required),
        },
        { validators: ResetPassword.passwordMatch() }
      ),
    });
  }

  ngOnInit(): void {
    this.extractTokenFromUrl();
  }

  extractTokenFromUrl(): void {
    this._route.queryParams.pipe(takeUntil(this._destroy$)).subscribe(params => {
      this.token = params['token'];

      if (!this.token) {
        this.handleInvalidToken();
      } else {
        this.loadUserInfo();
      }
    });
  }

  handleInvalidToken(): void {
    this.serverErrors = { global: 'Lien de réinitialisation invalide ou expiré' };
    setTimeout(() => this._router.navigate(['/']), TIME);
  }

  loadUserInfo(): void {
    this.isLoading = true;

    this._resetPasswordService
      .getUserInfoByToken(this.token)
      .pipe(
        takeUntil(this._destroy$),
        catchError(error => this.handleUserInfoError(error))
      )
      .subscribe(userInfo => this.updateUserInfo(userInfo));
  }

  handleUserInfoError(error: ActionDeleteItem): Observable<never> {
    this.serverErrors = { global: 'Impossible de récupérer vos informations' };
    this.isLoading = false;
    return throwError(() => error);
  }

  updateUserInfo(userInfo: { firstName: string; lastName: string }): void {
    this.firstName = userInfo.firstName;
    this.lastName = userInfo.lastName;
    this.isLoading = false;
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.serverErrors = {};

    if (this.signUpForm.valid) {
      this.submitPasswordReset();
    }
  }

  submitPasswordReset(): void {
    const user: ResetPassword = ResetPassword.fromFormData(this.signUpForm.value);
    const resetPasswordDTO: ResetPasswordDTO & { token: string } = {
      ...user.toDTO(),
      token: this.token,
    };

    this._resetPasswordService
      .post$(resetPasswordDTO)
      .pipe(
        takeUntil(this._destroy$),
        catchError(error => this.handleSubmitError(error))
      )
      .subscribe(() => this.handleSubmitSuccess());
  }

  handleSubmitError(error: ActionDeleteItem): Observable<never> {
    this.serverErrors = this._errorService.handleServerErrors(error, this.signUpForm);
    return throwError(() => error);
  }

  handleSubmitSuccess(): void {
    this.resetSuccess = true;
    setTimeout(() => {
      this._router.navigate(['/']);
    }, TIME);
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
