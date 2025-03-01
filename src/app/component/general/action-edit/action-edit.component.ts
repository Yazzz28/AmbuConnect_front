import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';

type FieldConfig = {
  field: string;
  type?: string;
  label?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
};

type NestedFieldConfig = {
  name: string;
  prefix: string;
  fields: string[];
};

@Component({
  selector: 'app-action-edit',
  imports: [Button, Dialog, ReactiveFormsModule],
  templateUrl: './action-edit.component.html',
  styleUrls: ['./action-edit.component.scss'],
})
export class ActionEditComponent {
  @Input() itemBase!: any;
  @Input() formUpdate!: FieldConfig[];
  @Input() facadeService!: any;
  @Input() fieldToShow!: string;
  @Input() fieldToShowTwo!: string;
  @Input() mainFieldsConfig!: string[];
  @Input() nestedFieldsConfig!: NestedFieldConfig[];

  item: any = null;
  visible = false;
  form!: FormGroup;

  fb: FormBuilder = inject(FormBuilder);

  // Method to create the form
  createForm(): void {
    const formControls = this.formUpdate.reduce((controls: Record<string, FormControl>, fieldConfig) => {
      const value = this.getNestedValue(this.item, fieldConfig.field);
      controls[fieldConfig.field] = this.createFormControl(fieldConfig, value);
      return controls;
    }, {});

    this.form = this.fb.group(formControls);
  }

  // Create a FormControl with validations for each field
  createFormControl(fieldConfig: FieldConfig, value: any): FormControl {
    const validators = [];
    if (fieldConfig.required) {
      validators.push(Validators.required);
    }

    // Handle boolean fields specifically
    if (fieldConfig.type === 'boolean') {
      value = value !== undefined ? Boolean(value) : false;
    }

    return new FormControl(value, validators);
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  // Show dialog and load data for item
  showDialog(): void {
    if (this.itemBase) {
      this.facadeService.getById$(this.itemBase.id).subscribe({
        next: (itemComplete: any) => {
          this.item = itemComplete;
          console.log(this.item);
          this.createForm();
        },
      });
      this.visible = true;
    }
  }

  // Close the dialog
  closeDialog(): void {
    this.visible = false;
  }

  save(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      const formValue = this.form.value;
      const formattedData: any = {};

      // Inclure l'ID dans les données formatées
      if (this.item && this.item.id) {
        formattedData.id = this.item.id;
      }

      // Traiter les champs principaux (fields configurés)
      this.mainFieldsConfig.forEach((field: string) => {
        if (formValue[field] !== undefined) {
          formattedData[field] = formValue[field];
        }
      });

      // Traiter les champs imbriqués
      this.nestedFieldsConfig.forEach(nestedField => {
        const nestedData: any = {};

        // Récupérer les données imbriquées en utilisant le préfixe
        nestedField.fields.forEach((field: string) => {
          const nestedValue = formValue[`${nestedField.prefix}.${field}`] || formValue[nestedField.prefix]?.[field];
          if (nestedValue !== undefined) {
            nestedData[field] = nestedValue;
          }
        });

        // Ajouter les données imbriquées dans le champ principal correspondant
        if (Object.keys(nestedData).length > 0) {
          formattedData[nestedField.name] = nestedData;
        }
      });

      console.log('Formatted data to send:', formattedData);

      // Envoyer les données au service
      this.facadeService.update$(formattedData).subscribe({
        error: (err: any) => {
          console.error('Error saving data:', err);
        },
      });

      this.closeDialog();
    }
  }
}
