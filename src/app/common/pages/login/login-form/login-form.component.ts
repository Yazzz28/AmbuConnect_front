import { Component, DestroyRef, EventEmitter, inject, Output } from '@angular/core';
import { DarkBlueButtonComponent } from '../../../components/dark-blue-button/dark-blue-button.component';
import { FormFieldComponent } from '../../../components/form/form-field/form-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ActionDeleteItem } from '../../../../general/type/custom-type';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [DarkBlueButtonComponent, FormFieldComponent, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  @Output() formSubmitted = new EventEmitter<{ email: string; password: string }>();
  loginForm: FormGroup;
  errorMessage: string | null = null;
  fieldErrors: Record<string, string> = {};
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  serverErrors: Record<string, string> = {};
  private _authService: AuthService = inject(AuthService);
  private _fb: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this._isFormInvalid()) {
      return;
    }
    this._resetErrorState();
    this._setLoadingState(true);
    const credentials = this.loginForm.value;
    this.formSubmitted.emit(credentials);
    this._performLogin(credentials);
  }

  private _isFormInvalid(): boolean {
    return this.loginForm.invalid;
  }

  private _resetErrorState(): void {
    this.serverErrors = {};
    this.errorMessage = null;
    this.fieldErrors = {};
  }

  private _setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
  }

  private _performLogin(credentials: { email: string; password: string }): void {
    this._authService
      .login(credentials)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => this._handleLoginSuccess(),
        error: err => this._handleLoginError(err),
      });
  }

  private _handleLoginSuccess(): void {
    this._setLoadingState(false);
    this._router.navigate(['/']);
  }

  private _handleLoginError(error: ActionDeleteItem): void {
    this._setLoadingState(false);
    if (error.field) {
      this.fieldErrors[error.field] = error.message;
    } else {
      this.errorMessage = error.message;
    }
  }
}
