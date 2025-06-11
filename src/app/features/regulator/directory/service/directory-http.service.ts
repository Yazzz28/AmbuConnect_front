import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient, PatientTableDTO } from '../model/patient.model';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DirectoryHttpService {
  private _http: HttpClient = inject(HttpClient);
  private _baseUrl: string = environment.apiUrl;

  getRegularPatients$(): Observable<PatientTableDTO[]> {
    return this._http.get<PatientTableDTO[]>(`${this._baseUrl}/patients`);
  }

  getPatientById$(patientId: string): Observable<Patient> {
    return this._http.get<Patient>(`${this._baseUrl}/patients/${patientId}`);
  }

  create$(patient: Patient): Observable<Patient> {
    return this._http.post<Patient>(`${this._baseUrl}/patients`, patient);
  }

  update$(patient: Patient): Observable<Patient> {
    return this._http.put<Patient>(`${this._baseUrl}/patients/${patient.id}`, patient);
  }

  delete$(patientId: string): Observable<void> {
    return this._http.delete<void>(`${this._baseUrl}/patients/${patientId}`);
  }
}
