import { inject, Injectable } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { TransporterHttpService } from './transporter-http.service';
import { TransporterStoreService } from './transporter-store.service';
import { CalendarViewDTO } from '../transport.interface';

@Injectable({
  providedIn: 'root',
})
export class TransporterFacadeService {
  httpService = inject(TransporterHttpService);
  storeService = inject(TransporterStoreService);

  get transports$(): Observable<CalendarViewDTO[]> {
    return this.storeService.state$.pipe(map(state => state.transports));
  }

  get loading$(): Observable<boolean> {
    return this.storeService.state$.pipe(map(state => state.loading));
  }

  get error$(): Observable<string | null> {
    return this.storeService.state$.pipe(map(state => state.error));
  }

  get selectedTransport$(): Observable<CalendarViewDTO | null> {
    return this.storeService.state$.pipe(map(state => state.selectedTransport));
  }

  get emergencyTransports$(): Observable<CalendarViewDTO[]> {
    return this.transports$.pipe(map(transports => transports.filter(transport => transport.isEmergency)));
  }

  get regularTransports$(): Observable<CalendarViewDTO[]> {
    return this.transports$.pipe(map(transports => transports.filter(transport => !transport.isEmergency)));
  }

  loadTransports(): void {
    this.storeService.setLoading(true);

    this.httpService
      .getAllTransports()
      .pipe(
        tap(transports => this.storeService.setTransports(transports)),
        catchError(error => {
          this.storeService.setError('Erreur lors du chargement des transports');
          console.error('Error loading transports:', error);
          return of([]);
        }),
        finalize(() => this.storeService.setLoading(false))
      )
      .subscribe();
  }

  loadTransportById(id: number): Observable<CalendarViewDTO | null> {
    this.storeService.setLoading(true);

    return this.httpService.getTransportById(id).pipe(
      tap(transport => this.storeService.selectTransport(transport)),
      catchError(error => {
        this.storeService.setError('Erreur lors du chargement du transport');
        console.error('Error loading transport:', error);
        return of(null);
      }),
      finalize(() => this.storeService.setLoading(false))
    );
  }

  loadTransportsByVehicleId(vehicleId: number): void {
    this.storeService.setLoading(true);

    this.httpService
      .getTransportsByVehicleId(vehicleId)
      .pipe(
        tap(transports => this.storeService.setTransports(transports)),
        catchError(error => {
          this.storeService.setError('Erreur lors du chargement des transports du véhicule');
          console.error('Error loading vehicle transports:', error);
          return of([]);
        }),
        finalize(() => this.storeService.setLoading(false))
      )
      .subscribe();
  }

  updateTransport(id: number, transport: CalendarViewDTO): Observable<CalendarViewDTO | null> {
    this.storeService.setLoading(true);

    return this.httpService.updateTransport(id, transport).pipe(
      tap(updatedTransport => {
        this.storeService.updateTransport(updatedTransport);
        this.storeService.selectTransport(updatedTransport);
      }),
      catchError(error => {
        this.storeService.setError('Erreur lors de la mise à jour du transport');
        console.error('Error updating transport:', error);
        return of(null);
      }),
      finalize(() => this.storeService.setLoading(false))
    );
  }

  selectTransport(transport: CalendarViewDTO | null): void {
    this.storeService.selectTransport(transport);
  }

  clearError(): void {
    this.storeService.setError(null);
  }

  refresh(): void {
    this.loadTransports();
  }

  reset(): void {
    this.storeService.reset();
  }

  getTransportsByType(type: string): Observable<CalendarViewDTO[]> {
    return this.transports$.pipe(map(transports => transports.filter(transport => transport.type.toLowerCase().includes(type.toLowerCase()))));
  }

  getTransportStats(): Observable<{ total: number; emergency: number; regular: number }> {
    return this.transports$.pipe(
      map(transports => ({
        total: transports.length,
        emergency: transports.filter(t => t.isEmergency).length,
        regular: transports.filter(t => !t.isEmergency).length,
      }))
    );
  }
}
