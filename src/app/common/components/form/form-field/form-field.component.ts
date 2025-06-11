import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ErrorMessageService } from '../../../../features/management/registration/service/error-message/error-message.service';
import { PasswordToggleComponent } from '../../password-toggle/password-toggle.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActionDeleteItem } from '../../../../general/type/custom-type';

export type FieldOption = {
  [key: string]: string | number;
  label: string;
  value: string | number;
};

const DEFAULT_MIN_LENGTH = 2;

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PasswordToggleComponent],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnInit {
  @Input() control!: AbstractControl | null;
  @Input() parentFormGroup: AbstractControl | null = null;
  @Input() name: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() isSubmitted: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() minLength: number = DEFAULT_MIN_LENGTH;
  @Input() serverErrors: Record<string, string> | null = null;
  @Input() customErrorMessages: Record<string, string> = {};
  @Input() options: FieldOption[] = [];
  @Input() rows: number = 3;
  @Input() inputClass!: string;
  showPassword: boolean = false;
  private _errorService: ErrorMessageService = inject(ErrorMessageService);
  @Input() optionLabel!: string;

  getOptionProperty(option: ActionDeleteItem, propName?: string): string | number {
    if (!propName || typeof option !== 'object') {
      return option.toString();
    }
    return option[propName]?.toString() || '';
  }

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (this.control) {
      this.control.setValue(isChecked);
      this.control.markAsDirty();
      if (this.parentFormGroup) {
        this.parentFormGroup.updateValueAndValidity();
      }
    }
  }

  get hasParentGroupError(): boolean {
    return !!(this.parentFormGroup?.invalid && this.name === 'confirmPassword' && this.parentFormGroup?.errors?.['passwordsMismatch']);
  }

  get shouldShowError(): boolean {
    return !!((this.control?.invalid || this.hasParentGroupError) && (this.isSubmitted || this.control?.dirty || this.control?.touched));
  }

  get inputType(): string {
    return this.type === 'password' ? (this.showPassword ? 'text' : 'password') : this.type;
  }

  ngOnInit(): void {
    if (this.name === 'confirmPassword' && this.parentFormGroup) {
      this.parentFormGroup.statusChanges.pipe(takeUntilDestroyed()).subscribe(() => {
        this.control?.updateValueAndValidity({ emitEvent: false });
      });
    }
  }

  getAllErrorMessages(): string[] {
    const messages: string[] = [];
    if (this.control?.errors) {
      for (const key of Object.keys(this.control.errors)) {
        if (key === 'serverError') {
          if (this.control.errors[key].message) {
            messages.push(this.control.errors[key].message);
          }
        } else {
          messages.push(this._errorService.getErrorMessage(key, this.customErrorMessages, this.control.errors[key]));
        }
      }
    }
    if (this.hasParentGroupError) {
      messages.push(this._errorService.getErrorMessage('passwordsMismatch'));
    }
    return messages;
  }

  onInputChange(event: Event): void {
    const value: string = (event.target as HTMLInputElement).value;
    if (this.control) {
      this.control.setValue(value);
      this.control.markAsDirty();
      if (this.parentFormGroup) {
        this.parentFormGroup.updateValueAndValidity();
      }
    }
  }

  onBlur(): void {
    if (this.control) {
      this.control.markAsTouched();
    }
  }

  togglePasswordVisibility(isVisible: boolean): void {
    this.showPassword = isVisible;
  }
}
