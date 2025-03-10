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

  // Crée le formulaire en générant les FormControls à partir de formUpdate
  createForm(): void {
    const controls = this.formUpdate.reduce((acc, fieldConfig) => {
      const value = this.getNestedValue(this.item, fieldConfig.field);
      acc[fieldConfig.field] = this.createFormControl(fieldConfig, value);
      return acc;
    }, {} as Record<string, FormControl>);
    this.form = this.fb.group(controls);
  }

  // Crée un FormControl avec les validateurs nécessaires
  createFormControl({ required, type }: FieldConfig, value: any): FormControl {
    const validators = required ? [Validators.required] : [];
    if (type === 'boolean') {
      value = value !== undefined ? Boolean(value) : false;
    }
    return new FormControl(value, validators);
  }

  // Récupère la valeur imbriquée dans l'objet en fonction du chemin (path)
  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((o, key) => o?.[key], obj);
  }

  // Affiche le dialogue et charge les données de l'item
  showDialog(): void {
    if (!this.itemBase) return;
    this.visible = true;
    this.facadeService.getById$(this.itemBase.id).subscribe((item: any) => {
      this.item = item;
      this.createForm();
    });
  }

  // Ferme le dialogue
  closeDialog(): void {
    this.visible = false;
  }

  // Sauvegarde le formulaire après validation et formate les données
  save(): void {
    if (!this.form.valid) return;
    const formValue = this.form.value;
    const formattedData: any = this.item?.id ? { id: this.item.id } : {};

    // Traitement des champs principaux
    this.mainFieldsConfig.forEach(field => {
      if (formValue[field] !== undefined) {
        formattedData[field] = formValue[field];
      }
    });

    // Traitement des champs imbriqués
    this.nestedFieldsConfig.forEach(({ name, prefix, fields }) => {
      const nestedData = fields.reduce((acc, field) => {
        const value = formValue[`${prefix}.${field}`] ?? formValue[prefix]?.[field];
        if (value !== undefined) acc[field] = value;
        return acc;
      }, {} as any);
      if (Object.keys(nestedData).length) {
        formattedData[name] = nestedData;
      }
    });

    this.facadeService.update$(formattedData)({
      next: () => {
        this.closeDialog();
        console.log('Data saved:', formattedData);
      },
      error: (err: any) => console.error('Error saving data:', err),
    });
  }
}
