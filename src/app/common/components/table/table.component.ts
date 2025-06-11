import { Component, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Column } from '../../shared/models/column.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActionEditComponent } from '../action-page/action-edit/action-edit.component';
import { ActionDeleteComponent } from '../action-page/action-delete/action-delete.component';
import { ActionDeleteItem } from '../../../general/type/custom-type';
import { NgClass } from '@angular/common';

type FieldConfig = {
  field: string;
  type?: string;
  label?: string;
  required?: boolean;
  options?: { label: string; value: ActionDeleteItem }[];
  variant?: 'customCheckbox';
  customTemplate?: TemplateRef<ActionDeleteItem>;
};

@Component({
  selector: 'app-table',
  standalone: true,
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [InputText, TableModule, ActionEditComponent, ActionDeleteComponent, ReactiveFormsModule, NgClass],
})
export class TableComponent {
  @Input() data: ActionDeleteItem[] = [];
  @Input() columns: Column[] = [];
  @Input() globalFilterFields: string[] = [];
  @ViewChild('dt') dt!: Table;
  @Input() fieldToShow: string = '';
  @Input() facadeService!: ActionDeleteItem;
  @Input() fieldToShowTwo?: ActionDeleteItem;
  @Input() mainFieldsConfig: ActionDeleteItem[] = [];
  @Input() nestedFieldsConfig: ActionDeleteItem[] = [];
  @Input() form!: FieldConfig[];
  @Input() complexColumns: {
    field: string;
    header: string;
    type: 'array' | 'object';
    displayField?: string;
    formatter?: (value: ActionDeleteItem) => string;
  }[] = [];
  selectedItems: ActionDeleteItem[] = [];
  visible: boolean = false;
  fb: FormBuilder = inject(FormBuilder);
  $index: ActionDeleteItem;

  getNestedValue(rowData: ActionDeleteItem, field: string): string {
    const fields: string[] = field.split('.');
    let value: ActionDeleteItem = rowData;
    fields.forEach((field: string) => {
      value = value[field];
    });
    return value;
  }

  isComplexColumn(field: string): boolean {
    return this.complexColumns && this.complexColumns.some(col => col.field === field);
  }

  formatComplexValue(rowData: ActionDeleteItem, field: string): string {
    if (!rowData) return '';

    const complexCol = this.complexColumns?.find(col => col.field === field);
    if (!complexCol) return '';

    const value: ActionDeleteItem = rowData[field];
    if (value === null || value === undefined) return '';

    if (complexCol.type === 'array' && Array.isArray(value)) {
      if (complexCol.formatter) {
        return complexCol.formatter(value);
      }

      if (complexCol.displayField) {
        return value.map(item => item?.[complexCol.displayField!] || '').join(', ');
      }

      return value.join(', ');
    }

    if (complexCol.type === 'object' && value) {
      if (complexCol.formatter) {
        return complexCol.formatter(value);
      }

      if (complexCol.displayField) {
        return value[complexCol.displayField];
      }

      return JSON.stringify(value);
    }

    return '';
  }

  closeDialog(): void {
    this.visible = false;
  }
}
