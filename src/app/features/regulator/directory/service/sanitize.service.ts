import { Injectable } from '@angular/core';
import { PatientTableDTO } from '../model/patient.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SanitizeService {
  sanitizePhone(patients: Observable<PatientTableDTO[]>): Observable<PatientTableDTO[]> {
    return patients.pipe(
      map(patientArray =>
        (patientArray ?? []).map(patient => ({
          ...patient,
          phone: this._formatPhone(patient.phone),
        }))
      )
    );
  }

  private _formatPhone(phone?: string): string {
    if (!phone) return '';
    let formattedPhone: string = phone.replace(/^\+33/, '0');
    formattedPhone = formattedPhone.replace(/\D/g, '');
    return formattedPhone.replace(/(\d{2})(?=\d)/g, '$1.');
  }
}
