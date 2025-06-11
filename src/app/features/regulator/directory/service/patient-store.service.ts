import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PatientTableDTO } from '../model/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientStoreService {
  private _patients$: BehaviorSubject<PatientTableDTO[]> = new BehaviorSubject<PatientTableDTO[]>([]);

  get patients$(): Observable<PatientTableDTO[]> {
    return this._patients$.asObservable();
  }

  setAll(patients: PatientTableDTO[]): void {
    this._patients$.next(patients);
  }

  create(patient: PatientTableDTO): void {
    this._patients$.next([...this._patients$.value, patient]);
  }

  update(patient: PatientTableDTO): void {
    const updatedPatients: PatientTableDTO[] = this._patients$.value.map(p => (p.id === patient.id ? patient : p));
    this._patients$.next(updatedPatients);
  }

  delete(patientId: string): void {
    const updatedPatients: PatientTableDTO[] = this._patients$.value.filter(patient => patient.id !== patientId);
    this._patients$.next(updatedPatients);
  }
}
