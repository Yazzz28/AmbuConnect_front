import { Injectable } from '@angular/core';
import { Patient } from '../../directory/model/patient.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventSourceInput } from '@fullcalendar/core';
import { Calendar } from '../model/calendar.model';

@Injectable({
  providedIn: 'root',
})
export class ConvertEntityToCalendarService {
  convertDataToCalendarEvents(data: Observable<Calendar[]>): Observable<EventSourceInput> {
    return data.pipe(
      map((calendars: Calendar[]) => {
        return {
          events: calendars.map((entity: Calendar) => {
            let title = 'Sans patient';
            if (entity.patients && Array.isArray(entity.patients)) {
              title = entity.patients.map((patient: Patient) => `${patient.firstname || ''} ${patient.lastname || ''}`).join(', ');
            }

            const color = entity.vehicle?.color || '#CCCCCC';
            const isEmergency = entity.isEmergency;
            const textColor = isEmergency ? '#FFFFFF' : '#000000';
            const backgroundColor = isEmergency ? '#FF0000' : color;

            return {
              id: entity.id,
              title,
              type: entity.type,
              start: entity.startAt ? entity.startAt : undefined,
              end: entity.endAt ? entity.endAt : undefined,
              color,
              textColor,
              backgroundColor,
              editable: true,
              durationEditable: true,
              note: entity.note,
              extendedProps: {
                originalEntity: entity,
              },
            };
          }),
        };
      })
    );
  }
}
