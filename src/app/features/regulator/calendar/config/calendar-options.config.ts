import { CalendarOptions, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { ActionDeleteItem } from '../../../../general/type/custom-type';

export function getCalendarOptions(
  onAddClick: () => void,
  onEventDateChange: (info: EventDropArg | EventResizeDoneArg) => void,
  onEventClick: (info: ActionDeleteItem) => void
): CalendarOptions {
  return {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
    locale: 'fr',
    headerToolbar: {
      left: 'prev,next today,ajouter',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: "Aujourd'hui",
      month: 'Mois',
      week: 'Semaine',
      day: 'Jour',
      listWeek: 'Liste Semaine',
    },
    initialView: 'listWeek',
    firstDay: 1,
    allDaySlot: false,
    weekends: true,
    editable: true,
    eventResizableFromStart: true,
    eventDurationEditable: true,
    selectable: true,
    customButtons: {
      ajouter: {
        text: 'Ajouter',
        click: onAddClick,
      },
    },
    events: [],
    eventDrop: onEventDateChange,
    eventResize: onEventDateChange,
    eventClick: onEventClick,
  };
}
