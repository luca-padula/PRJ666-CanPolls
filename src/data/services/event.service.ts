import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import { Event } from 'src/data/Model/Event';
import { Location } from 'src/data/Model/Location'
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { User } from 'src/data/Model/User';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEventById(id: number) : Observable<Event>{
    return this.http.get<Event>(environment.apiUrl + '/api/event/' + id);
  }
  getAllEvents():Observable<Event[]>{
    return this.http.get<Event[]>(environment.apiUrl + '/api/events');
  }
  updateEventById(id: number, event: Event): Observable<any> {
    return this.http.put<Event>(environment.apiUrl + '/api/event/' + id, event);
  }

  getLocationByEventId(eventId: number): Observable<Location> {
    return this.http.get<Location>(environment.apiUrl + '/api/location/' + eventId);
  }

  updateLocationById(eventId: number, location: Location): Observable<any> {
    return this.http.put<Location>(environment.apiUrl + '/api/location/' + eventId, location);
  }

  getRegistrationsByEventId(eventId: number): Observable<EventRegistration[]> {
    return this.http.get<EventRegistration[]>(environment.apiUrl + '/api/event/' + eventId + '/registrations');
  }

  getRegisteredUsers(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/api/event/' + eventId + '/registeredUsers');
  }

  removeRegisteredUser(eventId: number, userId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/api/event/' + eventId + '/user/' + userId);
  }

  getAllEventsByUser(userId: number) : Observable<Event[]>
  {
    return this.http.get<Event[]>(environment.apiUrl + '/api/events/createdEvents/' + userId);
  }
}

//<td (click)="routeEvent(event.event_id)" style="text-decoration: underline;">{{event.event_title}}</td>