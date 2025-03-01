import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../component/general/table/table.component';
import { Observable } from 'rxjs';
import { PatientTableDTO } from '../model/patient.model';
import { Column } from '../../../general/type/column.model';
import { PatientFacadeService } from '../../utils/patient-facade.service';
import { SanitizeService } from '../service/sanitize.service';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.scss',
})
export class DirectoryComponent {
  patientsFacadeService: PatientFacadeService = inject(PatientFacadeService);

  columns: Column[] = [
    { field: 'lastname', header: 'Nom' },
    { field: 'firstname', header: 'Prenom' },
    { field: 'phone', header: 'Téléphone' },
    { field: 'addressString', header: 'Adresse' },
  ];

  mainFieldsConfig = ['id', 'lastname', 'firstname', 'phone', 'email', 'isRegular', 'hasOxygen', 'note'];
  nestedFieldsConfig = [
    {
      name: 'address',
      prefix: 'address',
      fields: ['address', 'additionnal', 'city', 'zipCode'],
    },
  ];

  form = [
    { field: 'lastname', label: 'Nom', type: 'text', required: true },
    { field: 'firstname', label: 'Prénom', type: 'text', required: true },
    { field: 'phone', label: 'Téléphone', type: 'tel', required: true },
    { field: 'email', label: 'Email', type: 'email', required: false },
    { field: 'address.address', label: 'Adresse', type: 'text', required: true },
    { field: 'address.additional', label: 'Complément', type: 'text', required: false },
    { field: 'address.city', label: 'Ville', type: 'text', required: true },
    { field: 'address.zipCode', label: 'Code postal', type: 'text', required: true },
    { field: 'hasOxygen', label: 'Oxygène', type: 'checkbox', required: false },
    { field: 'isRegular', label: 'Régulier', type: 'checkbox', required: false },
    { field: 'note', label: 'Note', type: 'textarea', required: false },
  ];

  globalFilterFields = ['firstname', 'lastname', 'phone', 'adressString'];

  fieldToShow = 'lastname';
  fieldToShowTwo = 'firstname';
  private _sanitized: SanitizeService = inject(SanitizeService);
  data$: Observable<PatientTableDTO[]> = this._sanitized.sanitizePhone(this.patientsFacadeService.getAll$());
}
