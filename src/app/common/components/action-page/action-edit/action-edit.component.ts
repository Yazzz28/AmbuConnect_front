import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DisplayFieldsPipe } from '../pipe/display-fields.pipe';
import { SkyBlueButtonComponent } from '../../sky-blue-button/sky-blue-button.component';
import { ActionDeleteItem } from '../../../../general/type/custom-type';
import { NestedFieldConfig } from '../types/nested-field-config.type';
import { FieldConfig } from '../types/field-config.type';
import iro from '@jaames/iro';
import { IroColor, IroColorPicker, IroColorPickerOptions } from '../types/ico-color';
import { NgClass } from '@angular/common';
import { MultiSelect } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { FieldOption } from '../../form/form-field/form-field.component';

const COLOR_PICKER_CONFIG = {
  TIMEOUT_MS: 100,
  WIDTH: 100,
  SLIDER_TYPE_SIZE: 20,
  PADDING: 4,
  HANDLE_RADIUS: 6,
  BORDER_WIDTH: 0,
  DEFAULT_COLOR: '#FFFFFF',
  FALLBACK_COLOR: '#000000',
};

@Component({
  selector: 'app-action-edit',
  imports: [Button, Dialog, ReactiveFormsModule, DisplayFieldsPipe, SkyBlueButtonComponent, NgClass, MultiSelect, Select, FormsModule],
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.scss'],
})
export class ActionEditComponent {
  @Input() itemBase!: ActionDeleteItem;
  @Input() formUpdate!: FieldConfig[];
  @Input() facadeService!: ActionDeleteItem;
  @Input() firstTitle!: string;
  @Input() secondTitle!: string;
  @Input() mainFieldsConfig!: string[];
  @Input() nestedFieldsConfig!: NestedFieldConfig[];
  @Input() separator: string = ' | ';
  @Input() mode: 'create' | 'edit' | 'view' = 'view';
  private _originalMode: 'create' | 'edit' | 'view' = 'view';
  public _displayMode: 'create' | 'edit' | 'view' = 'view';
  isReadOnly: boolean = false;

  item: ActionDeleteItem = null;
  visible: boolean = false;
  editForm!: FormGroup;
  colorValues: Record<string, string> = {};
  isSubmitting: boolean = false;

  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  createForm(): void {
    const controls = this.buildFormControls();
    this.editForm = this._formBuilder.group(controls);
  }

  buildFormControls(): Record<string, FormControl> {
    return this.formUpdate.reduce(
      (acc, fieldConfig) => {
        const value: ActionDeleteItem = this.getNestedValue(this.item, fieldConfig.field);
        acc[fieldConfig.field] = this.createFormControl(fieldConfig, value);

        if (fieldConfig.type === 'color') {
          this.colorValues[fieldConfig.field] = (value as string) || COLOR_PICKER_CONFIG.DEFAULT_COLOR;
        }

        return acc;
      },
      {} as Record<string, FormControl>
    );
  }

  createFormControl({ required, type }: FieldConfig, value: ActionDeleteItem): FormControl {
    const validators: ValidatorFn[] = required ? [Validators.required] : [];

    switch (type) {
      case 'email':
        validators.push(Validators.email);
        break;

      case 'tel':
        validators.push(Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/));
        break;

      case 'password':
        validators.push(Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/));
        break;

      case 'url':
        validators.push(Validators.pattern(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/));
        break;
      case 'time':
        validators.push(Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/));
        break;

      case 'color':
        validators.push(Validators.pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/));
        break;

      case 'boolean':
        value = value !== undefined ? Boolean(value) : false;
        break;

      case 'postalCode':
        validators.push(Validators.pattern(/^\d{5}(-\d{4})?$/));
        break;

      case 'multiselect':
        value = Array.isArray(value) ? value : [];
        break;
    }

    return new FormControl(value, validators);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.editForm.get(fieldName);

    if (!control || !control.errors || (!control.touched && !control.dirty)) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'Ce champ est obligatoire';
    }

    if (errors['email']) {
      return 'Veuillez entrer une adresse email valide';
    }

    if (errors['pattern']) {
      const fieldConfig = this.formUpdate.find(config => config.field === fieldName);

      switch (fieldConfig?.type) {
        case 'tel':
          return 'Veuillez entrer un numéro de téléphone valide';
        case 'password':
          return 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial';
        case 'url':
          return 'Veuillez entrer une URL valide';
        case 'time':
          return 'Veuillez entrer une heure au format HH:MM';
        case 'color':
          return 'Veuillez entrer une couleur hexadécimale valide (#RGB ou #RRGGBB)';
        case 'postalCode':
          return 'Veuillez entrer un code postal valide';
        default:
          return 'Format invalide';
      }
    }

    if (errors['minlength']) {
      return `Ce champ doit contenir au moins ${errors['minlength'].requiredLength} caractères`;
    }

    if (errors['maxlength']) {
      return `Ce champ ne doit pas dépasser ${errors['maxlength'].requiredLength} caractères`;
    }

    if (errors['min']) {
      return `La valeur minimale est ${errors['min'].min}`;
    }

    if (errors['max']) {
      return `La valeur maximale est ${errors['max'].max}`;
    }

    if (errors['invalidDate']) {
      return 'Veuillez entrer une date valide';
    }

    if (errors['invalidFileType']) {
      return 'Type de fichier non autorisé';
    }

    if (errors['invalidFileSize']) {
      return 'Taille de fichier trop importante';
    }

    if (errors['invalidCreditCard']) {
      return 'Numéro de carte de crédit invalide';
    }

    if (errors['invalidIban']) {
      return 'IBAN invalide';
    }

    return 'Erreur de validation';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.editForm.get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  getNestedValue(obj: ActionDeleteItem, path: string): ActionDeleteItem {
    return path.split('.').reduce((o: ActionDeleteItem, key: string) => (o ? o[key] : null), obj);
  }

  showDialog(): void {
    if ((this.mode === 'edit' || this.mode === 'view') && this.itemBase) {
      this._originalMode = this.mode;
      this._displayMode = this.mode;

      this.facadeService.getById$(this.itemBase.id).subscribe((item: ActionDeleteItem) => {
        this.item = item;
        this.createForm();

        this.isReadOnly = this.mode === 'view';

        if (this.isReadOnly) {
          Object.keys(this.editForm.controls).forEach(key => {
            this.editForm.get(key)?.disable();
          });
        } else {
          Object.keys(this.editForm.controls).forEach(key => {
            this.editForm.get(key)?.enable();
          });
        }

        this.visible = true;
        this.initColorPickersAfterDelay();
      });
    } else {
      this._originalMode = 'create';
      this._displayMode = 'create';
      this.item = {};
      this.createForm();
      this.isReadOnly = false;
      this.visible = true;
      this.initColorPickersAfterDelay();
    }
  }

  onDialogHide(): void {
    this.mode = this._originalMode;
    this._displayMode = this._originalMode;
    this.isReadOnly = this._originalMode === 'view';

    if (this.editForm) {
      if (this.isReadOnly) {
        Object.keys(this.editForm.controls).forEach(key => {
          this.editForm.get(key)?.disable();
        });
      } else {
        Object.keys(this.editForm.controls).forEach(key => {
          this.editForm.get(key)?.enable();
        });
      }
    }
  }

  showEditDialog(): void {
    this.facadeService.getById$(this.itemBase.id).subscribe({
      next: (item: ActionDeleteItem) => {
        this.item = item;
        this.createForm();
        this.visible = true;
        this.initColorPickersAfterDelay();
      },
    });
  }

  showCreateDialog(): void {
    this.item = {};
    this.createForm();
    this.visible = true;
    this.initColorPickersAfterDelay();
  }

  initColorPickersAfterDelay(): void {
    setTimeout(() => {
      this.initColorPickers();
    }, COLOR_PICKER_CONFIG.TIMEOUT_MS);
  }

  closeDialog(): void {
    this.visible = false;
    this.isSubmitting = false;
    if (this.editForm) {
      this.editForm.reset();
    }
    this.colorValues = {};

    setTimeout(() => {
      if (this.mode === 'edit' || this.mode === 'view') {
        this.mode = 'view';
        this.isReadOnly = true;
      }
    }, 0);
  }

  toggleMultiSelectItem(fieldName: string, item: ActionDeleteItem, event: ActionDeleteItem): void {
    const isChecked: ActionDeleteItem = event.target.checked;
    const currentItems: ActionDeleteItem = this.editForm.get(fieldName)?.value || [];
    const updatedItems: ActionDeleteItem[] = this.updateMultiSelectItems(currentItems, item, isChecked);
    this.editForm.get(fieldName)?.setValue(updatedItems);
  }

  updateMultiSelectItems(currentItems: ActionDeleteItem[], item: ActionDeleteItem, isChecked: ActionDeleteItem): ActionDeleteItem[] {
    let updatedItems: ActionDeleteItem[] = [...currentItems];

    if (isChecked) {
      if (!updatedItems.some((existingItem: ActionDeleteItem) => existingItem.id === item.id)) {
        updatedItems.push(item);
      }
    } else {
      updatedItems = updatedItems.filter((existingItem: ActionDeleteItem) => existingItem.id !== item.id);
    }

    return updatedItems;
  }

  save(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    if (this.mode === 'view' && !this.isReadOnly) {
      Object.keys(this.editForm.controls).forEach(key => {
        this.editForm.get(key)?.enable();
      });
      return;
    }

    if (this.mode === 'view') {
      return;
    }

    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue: ActionDeleteItem = this.editForm.value;
    const formattedData: ActionDeleteItem = this.prepareFormData(formValue);

    const observable: ActionDeleteItem = this.mode === 'edit' ? this.facadeService.update$(formattedData) : this.facadeService.create$(formattedData);

    observable.subscribe({
      next: () => {
        if (this.mode === 'edit') {
          this.mode = 'view';
          this._originalMode = 'view';
          this._displayMode = 'view';
          this.isReadOnly = true;

          Object.keys(this.editForm.controls).forEach(key => {
            this.editForm.get(key)?.disable();
          });

          setTimeout(() => {
            this.initColorPickers();
          }, COLOR_PICKER_CONFIG.TIMEOUT_MS);
        } else {
          this.closeDialog();
        }
      },
      error: (err: ActionDeleteItem) => console.error('Error saving data:', err),
    });
  }

  prepareFormData(formValue: ActionDeleteItem): ActionDeleteItem {
    const formattedData: ActionDeleteItem = this.mode === 'edit' && this.item?.id ? { id: this.item.id } : {};

    this.processMainFields(formattedData, formValue);

    this.processNestedFields(formattedData, formValue);

    this.processMultiSelectFields(formattedData, formValue);

    return formattedData;
  }

  processMainFields(formattedData: ActionDeleteItem, formValue: ActionDeleteItem): void {
    this.mainFieldsConfig.forEach(field => {
      if (formValue[field] !== undefined) {
        formattedData[field] = formValue[field];
      }
    });
  }

  processNestedFields(formattedData: ActionDeleteItem, formValue: ActionDeleteItem): void {
    this.nestedFieldsConfig.forEach(({ name, prefix, fields }: NestedFieldConfig) => {
      const nestedData: ActionDeleteItem = fields.reduce((acc: ActionDeleteItem, field: string) => {
        const value: ActionDeleteItem = formValue[`${prefix}.${field}`] ?? formValue[prefix]?.[field];
        if (value !== undefined) acc[field] = value;
        return acc;
      }, {} as ActionDeleteItem);

      if (Object.keys(nestedData).length) {
        formattedData[name] = nestedData;
      }
    });
  }

  processMultiSelectFields(formattedData: ActionDeleteItem, formValue: ActionDeleteItem): void {
    this.formUpdate.forEach(field => {
      if (field.type === 'multiselect' && formValue[field.field]) {
        formattedData[field.field] = formValue[field.field];
      }
    });
  }

  toggleEditMode(): void {
    if (this.mode === 'view') {
      this.mode = 'edit';
      this._displayMode = 'edit';
      this.isReadOnly = false;

      Object.keys(this.editForm.controls).forEach(key => {
        this.editForm.get(key)?.enable();
      });

      setTimeout(() => {
        this.initColorPickers();
      }, COLOR_PICKER_CONFIG.TIMEOUT_MS);
    }
  }

  getColorValue(fieldName: string): string {
    return this.colorValues[fieldName] || this.editForm.get(fieldName)?.value || COLOR_PICKER_CONFIG.FALLBACK_COLOR;
  }

  initColorPickers(): void {
    this.formUpdate.forEach(field => {
      if (field.type === 'color') {
        const initialColor: string = this.getColorValue(field.field);
        this.initColorPicker(field.field, initialColor);
      }
    });
  }

  initColorPicker(fieldName: string, initialColor: string): void {
    const elId = `color-picker-${fieldName}`;
    const el = document.getElementById(elId);

    if (!el) {
      console.warn(`Élément color picker non trouvé: ${elId}`);
      return;
    }

    el.innerHTML = '';

    const colorPickerOptions = this.createColorPickerOptions(initialColor);
    const colorPicker = this.createColorPickerInstance(elId, colorPickerOptions);

    if (!this.isReadOnly) {
      this.setupColorPickerEvents(colorPicker, fieldName);
    } else {
      this.disableColorPickerInteractions(colorPicker);
    }
  }

  createColorPickerOptions(initialColor: string): IroColorPickerOptions {
    return {
      width: COLOR_PICKER_CONFIG.WIDTH,
      color: initialColor,
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            wheelLightness: false,
          },
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'value',
            sliderSize: COLOR_PICKER_CONFIG.SLIDER_TYPE_SIZE,
          },
        },
      ],
      padding: COLOR_PICKER_CONFIG.PADDING,
      handleRadius: COLOR_PICKER_CONFIG.HANDLE_RADIUS,
      borderWidth: COLOR_PICKER_CONFIG.BORDER_WIDTH,
    };
  }

  disableColorPickerInteractions(colorPicker: IroColorPicker): void {
    colorPicker.off('color:change');

    const pickerElement = colorPicker.el;
    if (pickerElement) {
      pickerElement.classList.add('color-picker-readonly');
    }
  }

  createColorPickerInstance(elementId: string, options: IroColorPickerOptions): IroColorPicker {
    return new (iro.ColorPicker as ActionDeleteItem)(`#${elementId}`, options) as IroColorPicker;
  }

  setupColorPickerEvents(colorPicker: IroColorPicker, fieldName: string): void {
    colorPicker.on('color:change', (color: IroColor) => {
      this.editForm.get(fieldName)?.setValue(color.hexString);
      this.colorValues[fieldName] = color.hexString;
    });
  }

  getSelectedLabels(fieldName: string, options: FieldOption[] = []): string[] {
    const selectedValues = this.editForm.get(fieldName)?.value;

    if (!selectedValues || !Array.isArray(selectedValues) || selectedValues.length === 0) {
      return [];
    }

    return selectedValues
      .map((selectedValue: ActionDeleteItem) => {
        if (typeof selectedValue === 'object' && selectedValue !== null) {
          const matchingOption = options.find(option => {
            if (typeof option.value === 'object' && option.value !== null) {
              return this.compareObjects(selectedValue, option.value);
            }
            return false;
          });

          if (matchingOption) {
            return matchingOption.label;
          }

          return this.extractLabelFromObject(selectedValue);
        }

        const matchingOption = options.find(option => option.value === selectedValue);
        return matchingOption?.label ?? String(selectedValue);
      })
      .filter((label: string) => label && label.trim() !== '');
  }

  compareObjects(obj1: ActionDeleteItem, obj2: ActionDeleteItem): boolean {
    if (obj1?.id && obj2?.id) {
      return obj1.id === obj2.id;
    }

    if (obj1 === obj2) {
      return true;
    }

    try {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    } catch {
      return false;
    }
  }

  extractLabelFromObject(obj: ActionDeleteItem): string {
    if (!obj || typeof obj !== 'object') {
      return String(obj || '');
    }

    const labelProperties = ['name', 'label', 'title', 'displayName', 'firstname', 'lastname'];

    for (const prop of labelProperties) {
      if (obj[prop] && typeof obj[prop] === 'string') {
        return obj[prop];
      }
    }

    if (obj.name && this.isRoleObject(obj)) {
      return this.formatRoleName(obj.name);
    }

    return obj.toString !== Object.prototype.toString ? obj.toString() : '[Objet]';
  }

  isRoleObject(obj: ActionDeleteItem): boolean {
    return obj && typeof obj === 'object' && 'name' in obj && !('firstname' in obj);
  }

  formatRoleName(roleName: string): string {
    return roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
  }

  getSelectedLabel(fieldName: string, options: FieldOption[] = []): string {
    const selectedValue = this.editForm.get(fieldName)?.value;

    if (!selectedValue || !options || options.length === 0) {
      return 'Aucune sélection';
    }
    const matchingOption = options.find(option => option.value === selectedValue);

    return matchingOption?.label || selectedValue.toString();
  }
}
