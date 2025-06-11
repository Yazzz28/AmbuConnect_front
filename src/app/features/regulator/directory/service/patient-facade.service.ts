import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DirectoryHttpService } from './directory-http.service';
import { PatientStoreService } from './patient-store.service';
import { Patient, PatientTableDTO } from '../model/patient.model';

@Injectable({
  providedIn: 'root',
})
export class PatientFacadeService {
  private _directoryHttpService: DirectoryHttpService = inject(DirectoryHttpService);
  private _patientStoreService: PatientStoreService = inject(PatientStoreService);

  get patients$(): Observable<PatientTableDTO[]> {
    return this._patientStoreService.patients$;
  }

  loadAll$(): Observable<PatientTableDTO[]> {
    return this._directoryHttpService.getRegularPatients$().pipe(tap(patients => this._patientStoreService.setAll(patients)));
  }

  getById$(patientId: string): Observable<Patient> {
    return this._directoryHttpService.getPatientById$(patientId);
  }

  create$(patient: Patient): Observable<Patient> {
    return this._directoryHttpService.create$(patient).pipe(
      tap((createdPatient: Patient) => {
        const patientTableDTO: PatientTableDTO = this._convertPatientToPatientTableDTO(createdPatient);
        this._patientStoreService.create(patientTableDTO);
      })
    );
  }

  update$(patient: Patient): Observable<Patient> {
    return this._directoryHttpService.update$(patient).pipe(
      tap((updatedPatient: Patient) => {
        const patientTableDTO: PatientTableDTO = this._convertPatientToPatientTableDTO(updatedPatient);
        this._patientStoreService.update(patientTableDTO);
      })
    );
  }

  delete$(patientId: string): void {
    this._directoryHttpService
      .delete$(patientId)
      .pipe(tap(() => this._patientStoreService.delete(patientId)))
      .subscribe();
  }

  private _convertPatientToPatientTableDTO(patient: Patient): PatientTableDTO {
    return {
      id: patient.id,
      firstname: patient.firstname,
      lastname: patient.lastname,
      isRegular: patient.isRegular,
      phone: patient.phone,
      address: `${patient.address.adress} ${patient.address.additional} ${patient.address.city} ${patient.address.zipCode}`,
    };
  }
}
