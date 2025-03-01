import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientTableDTO } from '../directory/model/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientStoreService {
  private _patients$ = new BehaviorSubject<PatientTableDTO[]>([]);

  setAll$(patients: PatientTableDTO[]): Observable<PatientTableDTO[]> {
    this._patients$.next(patients);
    return this._patients$.asObservable();
  }

  create$(patient: PatientTableDTO): void {
    this._patients$.next([...this._patients$.value, patient]);
  }

  update$(patient: PatientTableDTO): void {
    const updatedPatient = this._patients$.value.map(p => (p.id === patient.id ? patient : p));
    this._patients$.next(updatedPatient);
  }

  delete$(patientId: string): void {
    const updatedPatient = this._patients$.value.filter(patient => patient.id !== patientId);
    this._patients$.next(updatedPatient);
  }
}
