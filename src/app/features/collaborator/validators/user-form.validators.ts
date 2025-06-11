import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup, AsyncValidatorFn } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { UserHttpService } from '../services/user/user-http.service';
import { ActionDeleteItem } from '../../../general/type/custom-type';

const VALUE_LENGTH = 10;

export class UserFormValidators {
  static minLengthValidator(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: ActionDeleteItem = (control.value || '').trim();
      return value.length >= min ? null : { minlength: { requiredLength: min } };
    };
  }

  static phoneNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value: ActionDeleteItem = control.value.toString().replace(/\D/g, '');
      return value.length === VALUE_LENGTH ? null : { phone: { requiredFormat: '10 chiffres' } };
    };
  }

  static emailFormat(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value: ActionDeleteItem = control.value;
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value) ? null : { email: true };
    };
  }

  static roleBasedDegreeFields(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const form = group as FormGroup;
      const roles: ActionDeleteItem = form.get('roles')?.value || [];

      const isParamedic: ActionDeleteItem = roles.some((r: ActionDeleteItem) => r.name === 'ROLE_PARAMEDIC' || r.name === 'Ambulancier');

      if (!isParamedic) return null;

      const degree: ActionDeleteItem = form.get('degree')?.value;
      const degreeDate: ActionDeleteItem = form.get('degreeExpirationDate')?.value;

      if (!degree || !degreeDate) {
        return { degreeMissing: true };
      }

      return null;
    };
  }

  static emailUniquenessValidator(userHttpService: UserHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email: ActionDeleteItem = control.value;

      if (!email) return new Observable(observer => observer.next(null));

      return userHttpService.getUsers$().pipe(
        map(users => {
          const emailTaken: boolean = users.some(u => u.email === email);
          return emailTaken ? { emailTaken: true } : null;
        })
      );
    };
  }
}
