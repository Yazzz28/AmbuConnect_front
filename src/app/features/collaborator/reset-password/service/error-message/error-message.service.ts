import { Injectable } from '@angular/core';
import { FormGroup, ValidationErrors } from '@angular/forms';
import { ServerErrorParams } from '../../../../../general/type/server-error-params';
import { ActionDeleteItem } from '../../../../../general/type/custom-type';

const ERROR_STATUS = 400;
const REQUIRED_LENGTH = 0;

@Injectable({
  providedIn: 'root',
})
export class ErrorMessageService {
  private _defaultMessages: Record<string, (params?: ServerErrorParams) => string> = {
    required: () => `Ce champ est requis.`,
    minlength: params => `Doit comporter au moins ${params?.requiredLength ?? REQUIRED_LENGTH} caractères.`,
    securePassword: (params = {}) => {
      const issues: ActionDeleteItem[] = [];
      if (!params.hasUpperCase) issues.push('une majuscule');
      if (!params.hasLowerCase) issues.push('une minuscule');
      if (!params.hasNumber) issues.push('un chiffre');
      if (!params.hasSpecialChar) issues.push('un caractère spécial');
      if (!params.isValidLength) issues.push('au moins 12 caractères');

      return `Le mot de passe doit contenir ${issues.join(', ')}.`;
    },
    passwordsMismatch: () => 'Les mots de passe ne correspondent pas.',
    serverError: params => params?.message || 'Une erreur est survenue.',
  };

  mapBackendFieldToFormField(backendField: string): string {
    const mapping: Record<string, string> = {
      password: 'passwords.password',
      confirmPassword: 'passwords.confirmPassword',
    };

    return mapping[backendField] || backendField;
  }

  handleServerErrors(error: ServerErrorParams, form: FormGroup): Record<string, string> {
    const serverErrors: Record<string, string> = {};

    if (error.status === ERROR_STATUS && error.error) {
      const errorData: ActionDeleteItem = error.error;

      if (errorData.field) {
        const field: ActionDeleteItem = errorData.field;
        const formField: string = this.mapBackendFieldToFormField(field);
        this._setControlError(form, formField, errorData.message);
      } else if (typeof error.error === 'object') {
        Object.entries(error.error).forEach(([field, message]) => {
          if (typeof message === 'string') {
            const formField: string = this.mapBackendFieldToFormField(field);
            this._setControlError(form, formField, message);
          }
        });
      }
    }
    return serverErrors;
  }

  private _setControlError(form: FormGroup, path: string, message: string): void {
    const control = form.get(path);

    if (control) {
      const existingErrors: ValidationErrors = control.errors || {};
      control.setErrors({
        ...existingErrors,
        serverError: message,
      });
      control.markAsTouched();
    }
  }
}
