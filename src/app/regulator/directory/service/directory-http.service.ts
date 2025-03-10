import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Patient, PatientTableDTO } from '../model/patient.model';

@Injectable({
  providedIn: 'root',
})
export class DirectoryHttpService {
  private _http = inject(HttpClient);
  private _baseUrl = 'https://127.0.0.1:8000/api/';
  private _regularPatientsUrl = `${this._baseUrl}patients`;
  private _patientUrl = `${this._baseUrl}patients`;

  getRegularPatients$(): Observable<PatientTableDTO[]> {
    return this._http.get<PatientTableDTO[]>(this._regularPatientsUrl).pipe(map(patients => patients.filter(patient => patient.isRegular)));
  }

  getPatientById$(patientId: string): Observable<Patient> {
    return this._http.get<Patient>(`${this._patientUrl}/${patientId}`);
  }

  create$(patient: Patient): Observable<Patient> {
    return this._http.post<Patient>(this._patientUrl, patient);
  }

  update$(patient: Patient): Observable<Patient> {
    return this._http.patch<Patient>(`${this._patientUrl}/${patient.id}`, patient);
  }

  delete$(patientId: string): Observable<void> {
    return this._http.delete<void>(`${this._patientUrl}/${patientId}`);
  }
}
