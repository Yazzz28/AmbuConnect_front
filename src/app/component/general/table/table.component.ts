import { Component, inject, Input, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { ActionEditComponent } from '../action-edit/action-edit.component';
import { ActionDeleteComponent } from '../action-delete/action-delete.component';
import { Column } from '../../../general/type/column.model';
import { Dialog } from 'primeng/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type FieldConfig = {
  field: string;
  type?: string;
  label?: string;
  required?: boolean;
  options?: { label: string; value: any }[];
};

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [InputText, TableModule, ActionEditComponent, ActionDeleteComponent, Dialog, ReactiveFormsModule],
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: Column[] = [];
  @Input() globalFilterFields: string[] = [];
  @ViewChild('dt') dt!: Table;
  @Input() fieldToShow: string = '';
  @Input() facadeService!: any;
  @Input() fieldToShowTwo?: any;
  @Input() mainFieldsConfig: any[] = [];
  @Input() nestedFieldsConfig: any[] = [];
  @Input() form!: FieldConfig[];

  selectedItems: any[] = [];

  visible: boolean = false;
  formGroup!: FormGroup;

  fb: FormBuilder = inject(FormBuilder);

  // Open the dialog for creating a new entry
  showDialog(): void {
    this.initializeForm(); // Initialize the form with empty values
    this.visible = true; // Show the dialog
  }

  // Close the dialog
  closeDialog(): void {
    this.visible = false;
  }

  // Initialize the form with default/empty values for new entry
  initializeForm(): void {
    const formControls = this.form.reduce((controls: Record<string, FormControl>, fieldConfig) => {
      // Set empty values for new entry
      controls[fieldConfig.field] = new FormControl(
        fieldConfig.type === 'checkbox' ? false : '', // Default value for checkbox is false
        fieldConfig.required ? [Validators.required] : []
      );
      return controls;
    }, {});

    this.formGroup = this.fb.group(formControls); // Create the form group with the controls
  }

  // Save the form data as a new record
  save(): void {
    if (this.formGroup.valid) {
      const formValue = this.formGroup.value;
      const formattedData: any = {};

      // Handle main fields configuration
      this.mainFieldsConfig.forEach((field: string) => {
        if (formValue[field] !== undefined) {
          formattedData[field] = formValue[field];
        }
      });

      // Handle nested fields configuration
      this.nestedFieldsConfig.forEach(nestedField => {
        const nestedData: any = {};

        nestedField.fields.forEach((field: string) => {
          const nestedValue = formValue[`${nestedField.prefix}.${field}`] || formValue[nestedField.prefix]?.[field];
          if (nestedValue !== undefined) {
            nestedData[field] = nestedValue;
          }
        });

        if (Object.keys(nestedData).length > 0) {
          formattedData[nestedField.name] = nestedData;
        }
      });
      // Send the formatted data to the service for creation
      this.facadeService.create$(formattedData)({
        next: () => {
          this.closeDialog(); // Correctly close the dialog
          console.log('Data saved:', formattedData);
        },
        error: (err: any) => {
          console.error('Error saving data:', err);
        },
      });
    }
  }
}
