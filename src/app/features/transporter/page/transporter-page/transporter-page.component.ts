import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { TransporterFacadeService } from '../../service/transporter-facade.service';
import { CalendarViewDTO, VehicleCalendarDTO } from '../../transport.interface';

@Component({
  selector: 'app-transporter-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transporter-page.component.html',
  styleUrl: './transporter-page.component.scss',
})
export class TransporterPageComponent implements OnInit, OnDestroy {
  private _facadeService = inject(TransporterFacadeService);
  private _currentFilterSubject = new BehaviorSubject<string>('all');

  transports$ = this._facadeService.transports$;
  loading$ = this._facadeService.loading$;
  error$ = this._facadeService.error$;
  selectedTransport$ = this._facadeService.selectedTransport$;
  transportStats$ = this._facadeService.getTransportStats();

  currentFilter: string = 'all';

  availableVehicles$ = this.transports$.pipe(
    map(transports => {
      return transports
        .filter(t => t.vehicle)
        .map(t => t.vehicle!)
        .filter((vehicle, index, array) => array.findIndex(v => v.id === vehicle.id) === index);
    })
  );

  filteredTransports$: Observable<CalendarViewDTO[]> = combineLatest([this.transports$, this._getCurrentFilter()]).pipe(
    map(([transports, filter]) => {
      if (filter === 'all') {
        return transports;
      }
      const vehicleId = parseInt(filter);
      return transports.filter(t => t.vehicle?.id === vehicleId);
    })
  );

  get transportStatsTotal(): number {
    let total = 0;
    this.transportStats$.subscribe(stats => {
      total = stats?.total || 0;
    });
    return total;
  }

  get isLoading(): boolean {
    let loading = false;
    this.loading$.subscribe(loadingState => {
      loading = loadingState;
    });
    return loading;
  }

  ngOnInit(): void {
    this.loadTransports();
  }

  ngOnDestroy(): void {
    this._facadeService.reset();
    this._currentFilterSubject.complete();
  }

  loadTransports(): void {
    this._facadeService.loadTransports();
  }

  refreshTransports(): void {
    this._facadeService.refresh();
  }

  selectTransport(transport: CalendarViewDTO): void {
    this._facadeService.selectTransport(transport);
  }

  setStart(transport: CalendarViewDTO, event: Event): void {
    event.stopPropagation();
    transport.startAt = this.getISOStringWithMicroseconds();
    this._facadeService.updateTransport(transport.id, transport);
    this.selectTransport(transport);
    console.log('Début mis à jour pour le transport :', transport);
  }

  setEnd(transport: CalendarViewDTO, event: Event): void {
    event.stopPropagation();
    transport.endAt = this.getISOStringWithMicroseconds();
    this._facadeService.updateTransport(transport.id, transport);
    this.selectTransport(transport);
    console.log('Fin mise à jour pour le transport :', transport);
  }

  getISOStringWithMicroseconds(date: Date = new Date()): string {
    const iso = date.toISOString(); // "2025-06-10T15:42:08.369Z"
    // Ajoutons 3 chiffres aléatoires ou fixes pour microsecondes après les millisecondes
    const microseconds = '903'; // ou génère aléatoire, par ex Math.floor(Math.random()*1000)
    return iso.replace('Z', microseconds + 'Z');
  }

  setFilter(filter: string): void {
    this.currentFilter = filter;
    this._currentFilterSubject.next(filter);
  }

  private _getCurrentFilter(): Observable<string> {
    return this._currentFilterSubject.asObservable();
  }

  clearError(): void {
    this._facadeService.clearError();
  }

  trackByTransportId(index: number, transport: CalendarViewDTO): number {
    return transport.id;
  }

  formatTime(dateTime: string): string {
    const date = new Date(dateTime);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  calculateDuration(startTime: string, endTime: string): string {
    const MS_PER_SECOND = 1000;
    const SECONDS_PER_MINUTE = 60;
    const MINUTES_PER_HOUR = 60;
    const ZERO = 0;

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / (MS_PER_SECOND * SECONDS_PER_MINUTE));

    if (diffMinutes < MINUTES_PER_HOUR) {
      return `${diffMinutes} min`;
    }
    const hours = Math.floor(diffMinutes / MINUTES_PER_HOUR);
    const minutes = diffMinutes % MINUTES_PER_HOUR;
    return minutes > ZERO ? `${hours}h ${minutes}min` : `${hours}h`;
  }

  getTypeBadgeClass(type: string): string {
    const normalizedType = type.toLowerCase();

    if (normalizedType.includes('urgence') || normalizedType.includes('emergency')) {
      return 'transport-type-badge emergency';
    }
    if (normalizedType.includes('medical') || normalizedType.includes('médical')) {
      return 'transport-type-badge medical';
    }
    return 'transport-type-badge regular';
  }

  formatPatientName(firstname: string, lastname: string): string {
    return `${firstname} ${lastname}`;
  }

  formatVehicleName(vehicle: VehicleCalendarDTO): string {
    return `${vehicle.registration}`;
  }

  getTransportCountForVehicle(vehicleId: number): Observable<number> {
    return this.transports$.pipe(map(transports => transports.filter(t => t.vehicle?.id === vehicleId).length));
  }

  isVehicleSelected(vehicleId: number): boolean {
    return this.currentFilter === vehicleId.toString();
  }

  isTransportInProgress(transport: CalendarViewDTO): boolean {
    const now = new Date();
    const start = new Date(transport.startAt);
    const end = new Date(transport.endAt);

    return now >= start && now <= end;
  }

  isTransportCompleted(transport: CalendarViewDTO): boolean {
    const now = new Date();
    const end = new Date(transport.endAt);

    return now > end;
  }

  isTransportUpcoming(transport: CalendarViewDTO): boolean {
    const now = new Date();
    const start = new Date(transport.startAt);

    return now < start;
  }

  getTransportStatus(transport: CalendarViewDTO): 'upcoming' | 'in-progress' | 'completed' {
    if (this.isTransportCompleted(transport)) {
      return 'completed';
    }
    if (this.isTransportInProgress(transport)) {
      return 'in-progress';
    }
    return 'upcoming';
  }

  getStatusIcon(transport: CalendarViewDTO): string {
    switch (this.getTransportStatus(transport)) {
      case 'completed':
        return 'fas fa-check-circle';
      case 'in-progress':
        return 'fas fa-clock';
      default:
        return 'fas fa-calendar';
    }
  }

  getStatusColor(transport: CalendarViewDTO): string {
    switch (this.getTransportStatus(transport)) {
      case 'completed':
        return 'text-success';
      case 'in-progress':
        return 'text-warning';
      default:
        return 'text-primary';
    }
  }

  hasOxygenPatient(transport: CalendarViewDTO): boolean {
    return transport.patients.some(patient => patient.hasOxygen);
  }

  getFormattedVehicleName(vehicle: VehicleCalendarDTO): string {
    return this.formatVehicleName(vehicle);
  }

  getVehicleTransportCount(vehicleId: number): number {
    let count = 0;
    this.getTransportCountForVehicle(vehicleId).subscribe(vehicleCount => {
      count = vehicleCount;
    });
    return count;
  }

  getFormattedStartTime(transport: CalendarViewDTO): string {
    return this.formatTime(transport.startAt);
  }

  getFormattedEndTime(transport: CalendarViewDTO): string {
    return this.formatTime(transport.endAt);
  }

  getCalculatedDuration(transport: CalendarViewDTO): string {
    return this.calculateDuration(transport.startAt, transport.endAt);
  }
}
