import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventInput } from '@fullcalendar/core';
import { Evenement } from './models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8081/evenements'; // Your backend API URL
  private eventsSubject = new BehaviorSubject<EventInput[]>([]);


  constructor(private http: HttpClient) { }

  // HTTP options (headers) for making API calls
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  // Handle API errors
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  // Get all events
  getEvents(): Observable<Evenement[]> {
    return this.http.get<Evenement[]>(`${this.apiUrl}/all`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Create a new event
  createEvent(event: EventInput): Observable<EventInput> {
    return this.http.post<EventInput>(`${this.apiUrl}/add`, JSON.stringify(event), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  createEvenement(event: Evenement) : Observable<Evenement> {
    return this.http.post<Evenement>(`${this.apiUrl}/add`, JSON.stringify(event), this.httpOptions)
     .pipe(
        catchError(this.handleError)
      );
  }
  // Update an event
  updateEvent(event: EventInput): Observable<EventInput> {
    const url = `${this.apiUrl}/${event.id}`;
    return this.http.put<EventInput>(url, JSON.stringify(event), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEvenement(event: Evenement): Observable<Evenement> {
    const url = `${this.apiUrl}/update`;
    return this.http.put<Evenement>(url, JSON.stringify(event), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Delete an event
  deleteEvent(eventId: number): Observable<any> {
    const url = `${this.apiUrl}/delete/${eventId}`;
    return this.http.delete<any>(url, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateEvents(events: EventInput[]) {
    this.eventsSubject.next(events);
  }
}
