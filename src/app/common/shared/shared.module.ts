import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputFieldComponent } from '../components/form/input-field/input-field.component';
import { SelectFieldComponent } from '../components/form/select-field/select-field.component';
import { AutoCompleteFieldComponent } from '../components/form/auto-complete-field/auto-complete-field.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent, SelectFieldComponent, AutoCompleteFieldComponent],
  exports: [InputFieldComponent, SelectFieldComponent, AutoCompleteFieldComponent],
})
export class SharedModule {}
