import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CalendarViewDTO, TransportState } from '../transport.interface';

@Injectable({
  providedIn: 'root',
})
export class TransporterStoreService {
  private readonly _initialState: TransportState = {
    transports: [],
    loading: false,
    error: null,
    selectedTransport: null,
  };

  private readonly _stateSubject = new BehaviorSubject<TransportState>(this._initialState);
  public readonly state$: Observable<TransportState> = this._stateSubject.asObservable();

  get currentState(): TransportState {
    return this._stateSubject.value;
  }

  setLoading(loading: boolean): void {
    this._updateState({ loading });
  }

  setTransports(transports: CalendarViewDTO[]): void {
    this._updateState({ transports, loading: false, error: null });
  }

  setError(error: string | null): void {
    this._updateState({ error, loading: false });
  }

  selectTransport(transport: CalendarViewDTO | null): void {
    this._updateState({ selectedTransport: transport });
  }

  updateTransport(updatedTransport: CalendarViewDTO): void {
    const transports = this.currentState.transports.map(transport => (transport.id === updatedTransport.id ? updatedTransport : transport));
    this._updateState({ transports });
  }

  addTransport(newTransport: CalendarViewDTO): void {
    const transports = [...this.currentState.transports, newTransport];
    this._updateState({ transports });
  }

  removeTransport(transportId: number): void {
    const transports = this.currentState.transports.filter(transport => transport.id !== transportId);
    this._updateState({ transports });
  }

  reset(): void {
    this._stateSubject.next(this._initialState);
  }

  private _updateState(partialState: Partial<TransportState>): void {
    this._stateSubject.next({
      ...this.currentState,
      ...partialState,
    });
  }
}
