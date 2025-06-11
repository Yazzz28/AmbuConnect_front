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
    email: () => "L'adresse e-mail n'est pas au bon format.",
    phone: params => `Le numéro de téléphone doit contenir ${params?.requiredFormat ?? 'un format valide'}.`,
    zipCode: params => `Le code postal doit contenir ${params?.requiredFormat ?? 'un format valide'}.`,
    siret: params => `Le numéro SIRET doit contenir ${params?.requiredFormat ?? 'un format valide'}.`,
    passwordsMismatch: () => 'Les mots de passe ne correspondent pas.',
    serverError: params => params?.message || 'Une erreur est survenue.',
  };

  getErrorMessage(errorKey: string, customMessages: Record<string, string> = {}, params: ServerErrorParams = {}): string {
    if (customMessages[errorKey]) {
      return customMessages[errorKey];
    }
    if (this._defaultMessages[errorKey]) {
      return this._defaultMessages[errorKey](params);
    }
    return `Erreur de validation: ${errorKey}`;
  }

  mapBackendFieldToFormField(backendField: string): string {
    const mapping: Record<string, string> = {
      email: 'email',
      password: 'passwords.password',
      confirmPassword: 'passwords.confirmPassword',
      firstname: 'firstname',
      lastname: 'lastname',
      phone: 'phone',
      name: 'companyName',
      siret: 'siret',
      adress: 'adress',
      city: 'city',
      zipCode: 'zipCode',
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
