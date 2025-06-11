import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActionDeleteItem } from '../../../../general/type/custom-type';
import { ResetPasswordDTO } from '../reset-passwordDTO';

const MIN_LENGTH = 12;

export class ResetPassword {
  password: string = '';
  confirmPassword: string = '';

  static securePassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: ActionDeleteItem = control.value || '';
      const hasUpperCase: boolean = /[A-Z]/.test(value);
      const hasLowerCase: boolean = /[a-z]/.test(value);
      const hasNumber: boolean = /\d/.test(value);
      const hasSpecialChar: boolean = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength: boolean = value.length >= MIN_LENGTH;

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isValidLength) {
        return {
          securePassword: {
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
            isValidLength,
          },
        };
      }

      return null;
    };
  }

  static passwordMatch(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password: string = formGroup.get('password')?.value;
      const confirmPassword: string = formGroup.get('confirmPassword')?.value;

      if (password !== confirmPassword) {
        return { passwordsMismatch: true };
      }

      return null;
    };
  }

  static fromFormData(formData: ActionDeleteItem): ResetPassword {
    const user = new ResetPassword();
    user.password = formData.passwords?.password || '';
    user.confirmPassword = formData.passwords?.confirmPassword || '';
    return user;
  }

  toDTO(): ResetPasswordDTO {
    return {
      password: this.password,
      confirmPassword: this.confirmPassword,
    };
  }
}
