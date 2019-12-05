import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import { Event } from 'src/data/Model/Event';
import {EventWithUserObj} from 'src/data/Model/EventWithUserObj'
import { Location } from 'src/data/Model/Location'
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { EventRegistrationWithUser } from 'src/data/Model/EventRegistrationWithUser';
import {Feedback} from 'src/data/Model/Feedback';
import { FeedbackDisplay } from '../Model/FeedbackDisplay';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEventById(id: number) : Observable<EventWithUserObj>{
    return this.http.get<EventWithUserObj>(environment.apiUrl + '/api/event/' + id);
  }
  getAllEvents(getAll: boolean):Observable<EventWithUserObj[]>{
    return this.http.get<EventWithUserObj[]>(environment.apiUrl + '/api/events/'+getAll);
  }

  // This function takes an event id and event data and updates that event with the new event data
  updateEventById(id: number, event: Event): Observable<any> {
    return this.http.put<Event>(environment.apiUrl + '/api/event/' + id, event);
  }

  // This function takes an event id and returns the location for that event
  getLocationByEventId(eventId: number): Observable<Location> {
    return this.http.get<Location>(environment.apiUrl + '/api/location/' + eventId);
  }

  // This function takes an event id and location data and updates that location with the new location data
  updateLocationById(eventId: number, location: Location): Observable<any> {
    return this.http.put<Location>(environment.apiUrl + '/api/location/' + eventId, location);
  }

  // This function takes an event id and returns all registrations for that event with their associated user
  getRegistrationsWithUsersByEventId(eventId: number): Observable<EventRegistrationWithUser[]> {
    return this.http.get<EventRegistrationWithUser[]>(environment.apiUrl + '/api/event/' + eventId + '/registrationData');
  }

  // This function returns a single registration for a specific event and user
  getRegistration(eventId: number, userId: string): Observable<EventRegistration> {
    return this.http.get<EventRegistration>(environment.apiUrl + '/api/event/' + eventId + '/registration/' + userId);
  }

  // This function returns a count of all the registrations (registration status is 'registered') for a given event id
  getRegistrationCount(eventId: number): Observable<number> {
    return this.http.get<number>(environment.apiUrl + '/api/event/' + eventId + '/registrationCount');
  }

  // This function takes an event id and a user id and registers that user for the event
  registerUserForEvent(eventId: number, userId: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/event/' + eventId + '/registerUser/' + userId, {});
  }

  // This function takes an event id and a user id and removes that user from registration for the event
  removeRegisteredUser(eventId: number, userId: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/api/event/' + eventId + '/user/' + userId);
  }

  // This function takes an event id and a string and cancels an event, providing the given reason for cancellation
  cancelEvent(eventId: number, reason: string): Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/event/' + eventId + '/cancel', {reason});
  }

  // This function takes an event id and a user id and cancels the user's registration for that event
  cancelRegistration(eventId: number, userId: number): Observable<any> {
    return this.http.delete<any>(environment.apiUrl + '/api/event/' + eventId + '/cancelRegistration/' + userId)
  }

  getAllEventsByUser(userId: number) : Observable<EventWithUserObj[]>
  {
    return this.http.get<EventWithUserObj[]>(environment.apiUrl + '/api/events/createdEvents/' + userId);
  }

  getAllEventsWithUser():Observable<EventWithUserObj[]>{
    return this.http.get<EventWithUserObj[]>(environment.apiUrl + '/api/eventsUser');
  }

  getEventsAttendedByUser(userId: number) : Observable<Event[]>
  {
    return this.http.get<Event[]>(environment.apiUrl + '/api/events/attendedByUser/' + userId);
  }
  
 

  uploadImage(filename: string):Observable<any>
  { 
    return this.http.post<any>(environment.apiUrl + '/api/upload/',filename);
  }
  getFeedbackByEventId(eventId: number):Observable<FeedbackDisplay[]>{
    return this.http.get<FeedbackDisplay[]>(environment.apiUrl+'/api/feedback/' + eventId);
  }
  getFeedbacksByUserId(userId: string) : Observable<Feedback[]>{
    return this.http.get<Feedback[]>(environment.apiUrl+'/api/feedbacks/' + userId);
  }
}
