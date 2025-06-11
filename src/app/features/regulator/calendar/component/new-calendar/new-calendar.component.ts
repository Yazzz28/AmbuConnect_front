import { AfterViewInit, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PatientFacadeService } from '../../../directory/service/patient-facade.service';
import { Patient, PatientTableDTO } from '../../../directory/model/patient.model';
import { Calendar } from '../../model/calendar.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateServices } from '../../../../../common/services/date.services';
import { AutoComplete } from 'primeng/autocomplete';
import { PrimeTemplate } from 'primeng/api';
import { FormFieldComponent } from '../../../../../common/components/form/form-field/form-field.component';
import { VehicleFacadeService } from '../../../../vehicle/service/vehicle-facade.service';
import { Vehicle, VehicleTableDTO } from '../../../../vehicle/model/vehicle.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { DeleteCalendarComponent } from '../delete-calendar/delete-calendar.component';
import { SkyBlueButtonComponent } from '../../../../../common/components/sky-blue-button/sky-blue-button.component';
import { DropdownModule } from 'primeng/dropdown';
import { Select } from 'primeng/select';

function frenchPhoneValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const phone = control.value.replace(/[-. ]/g, '');

  if (phone.startsWith('+33')) {
    const number = phone.substring(3);
    return /^[1-9]\d{8}$/.test(number) ? null : { invalidPhone: true };
  }

  if (phone.startsWith('0')) {
    return /^0[1-9]\d{8}$/.test(phone) ? null : { invalidPhone: true };
  }

  return { invalidPhone: true };
}

@Component({
  selector: 'app-new-calendar',
  standalone: true,
  imports: [
    CommonModule,
    Dialog,
    ReactiveFormsModule,
    FormsModule,
    AutoComplete,
    PrimeTemplate,
    FormFieldComponent,
    DeleteCalendarComponent,
    SkyBlueButtonComponent,
    DropdownModule,
    Select,
  ],
  templateUrl: './new-calendar.component.html',
  styleUrl: './new-calendar.component.scss',
})
export class NewCalendarComponent implements OnChanges, OnInit, AfterViewInit {
  dateServices = inject(DateServices);

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() eventToEdit?: Calendar;
  @Output() save = new EventEmitter<Calendar>();

  title = 'Ajouter un transport';
  calendarForm: FormGroup;

  allPatients: PatientTableDTO[] = [];
  filteredPatients: PatientTableDTO[] = [];

  allVehicles: VehicleTableDTO[] = [];
  filteredVehicles: VehicleTableDTO[] = [];

  isSubmitted = false;
  patientsLoaded = false;

  private readonly _destroyRef = inject(DestroyRef);
  private _fb = inject(FormBuilder);
  private _patientsFacadeService = inject(PatientFacadeService);
  private _vehicleFacadeService = inject(VehicleFacadeService);
  public eventId: string | undefined;

  transportTypes = [
    { label: 'Transfère', value: 'transfere' },
    { label: 'Urgence', value: 'urgence' },
    { label: 'Consultation', value: 'consultation' },
    { label: 'Hospitalisation', value: 'hospitalisation' },
    { label: 'Visite à domicile', value: 'visite' },
    { label: 'Retour à domicile', value: 'retour_domicile' },
    { label: 'Autre', value: 'autre' },
  ];

  constructor() {
    this.calendarForm = this._fb.group({
      type: ['', Validators.required],
      startAt: ['', Validators.required],
      endAt: ['', Validators.required],
      contactName: [''],
      contactPhone: ['', frenchPhoneValidator],
      isEmergency: [false],
      emergencyCode: [''],
      note: [''],
      startPlace: ['', Validators.required],
      endPlace: ['', Validators.required],
      vehicle: [null, Validators.required],
      patients: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadPatients();
    this.loadVehicles();
    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.calendarForm
      .get('type')
      ?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(type => {
        this.updateAddressFields(type);
      });

    this.calendarForm
      .get('patients')
      ?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(patients => {
        if (patients?.length > 0) {
          const currentType = this.calendarForm.get('type')?.value;
          if (currentType) {
            this.updateAddressFields(currentType);
          }
        }
      });
  }

  updateAddressFields(transportType: string): void {
    const patients = this.calendarForm.get('patients')?.value;
    if (!patients || patients.length === 0) {
      return;
    }
    const selectedPatient = patients[0];
    if (!selectedPatient) {
      return;
    }
    const patientAddress = this.formatPatientAddress(selectedPatient);
    if (!patientAddress) {
      return;
    }
    if (transportType === 'consultation' || transportType === 'hospitalisation') {
      this.calendarForm.get('startPlace')?.setValue(patientAddress);
    } else if (transportType === 'retour_domicile') {
      this.calendarForm.get('endPlace')?.setValue(patientAddress);
    }
  }

  formatPatientAddress(patient: PatientTableDTO): string {
    if (!patient) return '';

    const addressParts = [];
    if (patient.address) addressParts.push(patient.address);
    return addressParts.join(', ');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filterPatients({ query: '' });
    }, 500);
  }

  loadPatients(): void {
    this._patientsFacadeService
      .loadAll$()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe(patients => {
        this.allPatients = patients || [];
        this.filteredPatients = this.allPatients;
        this.patientsLoaded = true;

        if (this.eventToEdit && this.eventToEdit.patients) {
          this._patchFormFromEvent(this.eventToEdit);
        }
      });
  }

  loadVehicles(): void {
    this._vehicleFacadeService
      .getAll$()
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        catchError(() => {
          return of([]);
        })
      )
      .subscribe(vehicles => {
        this.allVehicles = vehicles || [];
        this.filteredVehicles = this.allVehicles;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventToEdit']) {
      this.isSubmitted = false;
      if (this.eventToEdit) {
        this.eventId = this.eventToEdit.id;
        this.title = 'Modifier le transport';

        if (this.patientsLoaded) {
          this._patchFormFromEvent(this.eventToEdit);
        }
      } else {
        this.title = 'Ajouter un transport';
        this.calendarForm.reset();
      }
    }

    if (changes['visible'] && this.visible) {
      setTimeout(() => {
        this.filterPatients({ query: '' });
      }, 100);
    }
  }

  closeDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSave(): void {
    this.isSubmitted = true;
    if (this.calendarForm.invalid) {
      this.calendarForm.markAllAsTouched();
      return;
    }

    const formValue = { ...this.calendarForm.value };
    if (formValue.startAt > formValue.endAt) {
      this.calendarForm.get('endAt')?.setErrors({ invalid: true });
      return;
    }

    if (formValue.startAt) {
      formValue.startAt = this._convertToOffsetDateTime(formValue.startAt);
    }

    if (formValue.endAt) {
      formValue.endAt = this._convertToOffsetDateTime(formValue.endAt);
    }

    this._vehicleFacadeService.getById$(formValue.vehicle.id).subscribe((vehicle: Vehicle) => {
      const calendarEvent: Calendar = {
        ...(this.eventToEdit || {}),
        ...formValue,
        vehicle,
      };
      this.save.emit(calendarEvent);
      this.closeDialog();
    });
  }

  private _convertToOffsetDateTime(localDatetime: string | Date): string {
    const date = typeof localDatetime === 'string' ? new Date(localDatetime) : localDatetime;
    return date.toISOString();
  }

  filterPatients(event: { query: string }): void {
    const query = event.query.toLowerCase();

    if (!this.allPatients || this.allPatients.length === 0) {
      return;
    }

    this.filteredPatients = this.allPatients.filter(
      p => p && p.lastname && p.firstname && `${p.lastname} ${p.firstname}`.toLowerCase().includes(query)
    );
  }

  filterVehicles(event: { query: string }): void {
    const q = event.query.toLowerCase();
    this.filteredVehicles = this.allVehicles.filter(v => v && v.registration && v.registration.toLowerCase().includes(q));
  }

  copyTransportInfo(): void {
    const f = this.calendarForm.value;
    const transportInfo =
      `Type: ${f.type}\n` +
      `Début: ${this.dateServices.formatDateFr(f.startAt)}\n` +
      `Fin: ${this.dateServices.formatDateFr(f.endAt)}\n` +
      `Contact: ${f.contactName || ''} (${f.contactPhone || ''})\n` +
      `Urgence: ${f.isEmergency ? 'Oui' : 'Non'} ${f.emergencyCode ? '(' + f.emergencyCode + ')' : ''}\n` +
      `Note: ${f.note || ''}\n` +
      `Départ: ${f.startPlace}\n` +
      `Arrivée: ${f.endPlace}\n` +
      `Patients: ${f.patients && f.patients.length ? f.patients.map((p: Patient) => p.lastname + ' ' + p.firstname).join(', ') : 'Aucun'}`;

    navigator.clipboard.writeText(transportInfo);
  }

  private _patchFormFromEvent(event: Calendar): void {
    const patch: Calendar = { ...event };
    patch.startAt = this._toLocalDatetimeString(new Date(event.startAt));
    patch.endAt = this._toLocalDatetimeString(new Date(event.endAt));
    patch.vehicle = event.vehicle;

    if (event.patients && Array.isArray(event.patients)) {
      patch.patients = event.patients.map(p => ({ ...p }));
    } else {
      patch.patients = [];
    }

    patch.isEmergency = event.isEmergency;

    this.calendarForm.patchValue({
      type: patch.type,
      startAt: patch.startAt,
      endAt: patch.endAt,
      contactName: patch.contactName,
      contactPhone: patch.contactPhone,
      isEmergency: patch.isEmergency,
      emergencyCode: patch.emergencyCode,
      note: patch.note,
      startPlace: patch.startPlace,
      endPlace: patch.endPlace,
      vehicle: patch.vehicle,
      patients: patch.patients,
    });
  }

  private _toLocalDatetimeString(date: Date): string {
    const d = new Date(date);
    const pad = (n: number): string => n.toString().padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onDeleteSuccess(visible: boolean): void {
    if (!visible) {
      this.closeDialog();
    }
  }
}
