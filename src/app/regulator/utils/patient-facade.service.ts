import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { DirectoryHttpService } from '../directory/service/directory-http.service';
import { PatientStoreService } from './patient-store.service';
import { Patient, PatientTableDTO } from '../directory/model/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientFacadeService {
  private _directoryHttpService = inject(DirectoryHttpService);
  private _patientStoreService = inject(PatientStoreService);

  /** Get all patients and update the store */
  getAll$(): Observable<PatientTableDTO[]> {
    return this._directoryHttpService.getRegularPatients$().pipe(switchMap(patients => this._patientStoreService.setAll$(patients)));
  }

  getById$(patientId: string): Observable<Patient> {
    return this._directoryHttpService.getPatientById$(patientId);
  }

  create$(patient: Patient): void {
    this._directoryHttpService
      .create$(patient)
      .pipe(tap(() => this._patientStoreService.create$(patient)))
      .subscribe();
  }

  update$(patient: Patient): void {
    this._directoryHttpService
      .update$(patient)
      .pipe(tap(() => this._patientStoreService.update$(patient)))
      .subscribe();
  }

  delete$(patientId: string): void {
    this._directoryHttpService
      .delete$(patientId)
      .pipe(tap(() => this._patientStoreService.delete$(patientId)))
      .subscribe();
  }
}
