import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { PatientTableDTO } from '../model/patient.model';
import { PatientFacadeService } from '../service/patient-facade.service';
import { SanitizeService } from '../service/sanitize.service';
import { TableComponent } from '../../../../common/components/table/table.component';
import { Column } from '../../../../common/shared/models/column.model';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './directory.component.html',
  styleUrl: './directory.component.scss',
})
export class DirectoryComponent implements OnInit {
  patientsFacadeService: PatientFacadeService = inject(PatientFacadeService);
  private _sanitized: SanitizeService = inject(SanitizeService);

  columns: Column[] = [
    { field: 'lastname', header: 'Nom' },
    { field: 'firstname', header: 'Prenom' },
    { field: 'phone', header: 'Téléphone' },
    { field: 'adress', header: 'Adresse' },
  ];

  mainFieldsConfig: string[] = ['id', 'lastname', 'firstname', 'phone', 'email', 'isRegular', 'hasOxygen', 'note'];
  nestedFieldsConfig = [
    {
      name: 'adress',
      prefix: 'adress',
      fields: ['adress', 'additional', 'city', 'zipCode'],
    },
  ];

  form = [
    { field: 'lastname', label: 'Nom', type: 'text', required: true },
    { field: 'firstname', label: 'Prénom', type: 'text', required: true },
    { field: 'phone', label: 'Téléphone', type: 'tel', required: true },
    { field: 'email', label: 'Email', type: 'email', required: false },
    { field: 'adress.adress', label: 'Adresse', type: 'text', required: true },
    { field: 'adress.additional', label: 'Complément', type: 'text', required: false },
    { field: 'adress.city', label: 'Ville', type: 'text', required: true },
    { field: 'adress.zipCode', label: 'Code postal', type: 'text', required: true },
    { field: 'hasOxygen', label: 'Oxygène', type: 'checkbox', required: false },
    { field: 'isRegular', label: 'Régulier', type: 'checkbox', required: false },
    { field: 'note', label: 'Note', type: 'textarea', required: false },
  ];

  globalFilterFields: string[] = ['firstname', 'lastname', 'phone', 'adress'];
  fieldToShow: string = 'lastname';
  fieldToShowTwo: string = 'firstname';

  data$: Observable<PatientTableDTO[]> = this._sanitized.sanitizePhone(this.patientsFacadeService.patients$ ?? of([]));

  ngOnInit(): void {
    this.patientsFacadeService.loadAll$().subscribe();
  }
}
