import { EventInput } from '@fullcalendar/core';

let eventGuid = 0;
export const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR,
    color: 'green'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: '2024-04-01',
    end: '2024-04-01',
    color: 'red',
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00',
    color: 'purple'
  },
  {
    title: 'Long Event',
    start: '2024-03-25',
    end: '2024-03-27',
    color: 'purple' // override!
  },
  
];

export function createEventId() {
  return String(eventGuid++);
}