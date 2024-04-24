import { Component, signal, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import { FormsModule, NgForm } from '@angular/forms';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import frlocale from '@fullcalendar/core/locales/fr';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../../app/event.service';
import { HttpClientModule } from '@angular/common/http';
import { Evenement } from '../models/event.model';


/* interface EventItem {
  Title: String;
  Color: String;
} */

@Component({
  selector: 'app-deroulement',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './deroulement.component.html',
  styleUrl: './deroulement.component.css'
})
export class DeroulementComponent implements OnInit {
  editEv: Evenement = {
    id: 0,
    title: '',
    date_debut: '',
    date_fin: ''
  };

  ListColor: string[] = ["primary", "secondary", "success", "danger", "warning", "info"];
  colorAdd: string = "primary";
  eventTitle = new FormControl();
  ListTitle: any = [];
  ListEventInput: EventInput[] = [];
  ListEvenements: Evenement[] = [];

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    locale: frlocale,
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
      bootstrap5Plugin
    ],
    themeSystem: 'bootstrap5',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    events: this.ListEventInput, // Initially empty, will be populated in ngOnInit
    weekends: true,
    editable: true,
    selectable: true,
    droppable: true,
    drop: this.handleDrop.bind(this),
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private eventService: EventService, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(
      (evenements: Evenement[]) => {
        this.ListEvenements = evenements;
        this.refreshCalendarEvents(); // Refresh calendar events after fetching data
      },
      (error: any) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  ngAfterViewInit() {
    const containerEl = document.getElementById('external-events');

    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
          return {
            title: eventEl.innerText
          };
        }
      });
    }
  }

  handleDrop(info: any) {
    const checkbox = document.getElementById('drop-remove') as HTMLInputElement;
    if (checkbox && checkbox!.checked) {
      info.draggedEl.parentNode?.removeChild(info.draggedEl);
    }

    const draggedEvent = info.draggedEl.innerText;
    const event = this.ListEventInput.find(event => event.title === draggedEvent);
    if (event) {
      const newEvent: EventInput = {
        title: event.title,
        start: new Date(info.date).toISOString(),
        backgroundColor: event.color as string
      };

      // Add the dropped event to the calendar
      const calendarApi = info.view.calendar;
      calendarApi.addEvent(newEvent);

      // Save the dropped event to the backend
      const newEventBack: Evenement = {
        id: 0,
        title: newEvent.title || '',
        date_debut: newEvent.start?.toString() || "",
        date_fin: newEvent.end?.toString() || ""
      };

      this.eventService.createEvenement(newEventBack).subscribe(
        (createdEvenement: Evenement) => {
          // Update the event with the ID from the backend
          newEvent.id = createdEvenement.id?.toString() || '';
          this.ListEvenements.push(createdEvenement); // Add to local list
          this.TransformListToInputEvent(this.ListEvenements); // Update EventInput list
          (this.calendarOptions as CalendarOptions).events = this.ListEventInput; // Update events for calendar
          this.changeDetector.detectChanges();  // Detect changes
          this.refreshCalendarEvents();
        },
        (error: any) => {
          console.error('Error creating event:', error);
          // Remove the dropped event from the calendar if save fails
          calendarApi.getEventById(newEvent.id)?.remove();
        }
      );
      console.log(newEventBack);
    }
  }


  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // Clear date selection

    if (title) {
      const newEvent: EventInput = {
        title: title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      };

      calendarApi.addEvent(newEvent);

      this.ListEventInput.push(newEvent);
      /* this.refreshCalendarEvents(); */

      const newEventBack: Evenement = {
        id: 0,
        title: title,
        date_debut: selectInfo.startStr,
        date_fin: selectInfo.endStr
      };

      this.eventService.createEvenement(newEventBack).subscribe(
        (createdEvenement: Evenement) => {
          newEvent.id = createdEvenement.id?.toString() || '';
          this.ListEvenements.push(createdEvenement);
          this.TransformListToInputEvent(this.ListEvenements);
          (this.calendarOptions as CalendarOptions).events = this.ListEventInput; // Update events
          this.changeDetector.detectChanges(); // Detect changes//
        },
        (error: any) => {
          console.error('Error creating event:', error);
          this.ListTitle = this.ListEventInput.filter(event => event !== newEvent);
          this.refreshCalendarEvents();
        }
      );
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      const eventId = parseInt(clickInfo.event.id as string, 10);
      if (!isNaN(eventId)) {
        this.eventService.deleteEvent(eventId).subscribe(
          () => {
            this.ListEvenements = this.ListEvenements.filter(event => event.id !== eventId);
            this.refreshCalendarEvents();
          },
          (error) => {
            console.error('Error deleting event:', error);
          }
        );
      } else {
        console.error('Invalid event ID:', clickInfo.event.id);
      }
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  changeColorAdd(Color: string): void {
    this.colorAdd = Color;
  }

  addevent(color: string): void {
    const title = this.eventTitle.value.trim();
    if (title) {
      const newEvent: EventInput = {
        id: '',
        title: title,
        start: new Date().toISOString(),
        allDay: false,
        color: color
      };

      this.eventService.createEvent(newEvent).subscribe(
        (createdEvent: EventInput) => {
          newEvent.id = createdEvent.id?.toString() || '';
          this.refreshCalendarEvents();
          this.eventTitle.setValue('');
        },
        (error) => {
          console.error('Error creating event:', error);
          this.ListTitle = this.ListEventInput.filter(event => event !== newEvent);
          this.refreshCalendarEvents();
        }
      );
    }
  }

  refreshCalendarEvents(): void {
    this.TransformListToInputEvent(this.ListEvenements);
    this.calendarOptions.update((options: CalendarOptions) => ({
      ...options,
      events: this.ListEventInput
    }));
  }

  getRandomColor(): string {
    const colors = ['#007bff', '#6c757d', '#28a745', '#dc3545', '#ffc107', '#17a2b8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  addeventColor(color: string) {
    const title = this.eventTitle.value;
    if (title) {
      switch (color) {
        case "primary":
          color = "#007bff";
          break;
        case "secondary":
          color = "#6c757d";
          break;
        case "success":
          color = "#28a745";
          break;
        case "danger":
          color = "#dc3545";
          break;
        case "warning":
          color = "#ffc107";
          break;
        case "info":
          color = "#17a2b8";
          break;
        default:
          console.log("oops error !");
      }
      this.ListTitle.push({ title: title, color: <string>color });
      this.eventTitle.setValue('');
    }
  }

  deleteEvent(eventid: number) {
    this.eventService.deleteEvent(eventid).subscribe(
      () => {
        this.ListEvenements = this.ListEvenements.filter(event => event.id !== eventid);
        this.refreshCalendarEvents();
      },
      (error) => {
        console.error('Error deleting event:', error);
      }
    );
  }

  onOpenModal(event: Evenement) {
    this.editEv = event;
    const modal = document.getElementById('updateEventModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-hidden', 'false');
      const backdrop = document.createElement('div');
      backdrop.classList.add('modal-backdrop', 'fade', 'show');
      document.body.appendChild(backdrop);
    }
  }

  closeModal() {
    const modal = document.getElementById('updateEventModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-modal', 'false');
      modal.setAttribute('aria-hidden', 'true');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  editEvent(formData: any) {
    const editedEvent: Evenement = {
      id: formData.id,
      title: formData.title,
      date_debut: formData.date_debut,
      date_fin: formData.date_fin
    };

    this.eventService.updateEvenement(editedEvent).subscribe(
      (updatedEvent: Evenement) => {
        const index = this.ListEvenements.findIndex(event => event.id === updatedEvent.id);
        if (index !== -1) {
          this.ListEvenements[index] = updatedEvent;
        }

        this.refreshCalendarEvents();
        this.closeModal()
      },
      (error) => {
        console.error('Error updating event:', error);
      }
    );
  }

  TransformListToInputEvent(events: Evenement[]): void {
    this.ListEventInput = [];

    for (let i = 0; i < events.length; i++) {
      const eventInput: EventInput = {
        id: events[i].id?.toString() || '',
        title: events[i].title,
        start: events[i].date_debut,
        end: events[i].date_fin,
        color: this.getRandomColor()
      };

      this.ListEventInput.push(eventInput);
    }
  }
}