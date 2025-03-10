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
      .pipe(
        tap((createdPatient: Patient) => {
          const patientTableDTO = this._convertPatientToPatientTableDTO(createdPatient);
          this._patientStoreService.create$(patientTableDTO);
        })
      )
      .subscribe();
  }

  update$(patient: Patient): void {
    this._directoryHttpService
      .update$(patient)
      .pipe(
        tap(() => {
          const patientTableDTO = this._convertPatientToPatientTableDTO(patient);
          this._patientStoreService.update$(patientTableDTO);
        })
      )
      .subscribe();
  }

  delete$(patientId: string): void {
    this._directoryHttpService
      .delete$(patientId)
      .pipe(tap(() => this._patientStoreService.delete$(patientId)))
      .subscribe();
  }

  // Méthode de conversion de Patient en PatientTableDTO
  private _convertPatientToPatientTableDTO(patient: Patient): PatientTableDTO {
    return {
      id: patient.id,
      firstname: patient.firstname,
      lastname: patient.lastname,
      isRegular: patient.isRegular,
      phone: patient.phone,
      addressString: `${patient.address.address} ${patient.address.additionnal} ${patient.address.city} ${patient.address.zipCode}`,
    };
  }
}
