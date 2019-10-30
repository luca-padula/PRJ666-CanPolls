import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import { Event } from 'src/data/Model/Event';
import { User } from 'src/data/Model/User';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEventById(id: number) : Observable<Event>{
    return this.http.get<Event>(environment.apiUrl + '/api/event/' + id);
  }

  updateEventById(id: number, event: Event): Observable<any> {
    return this.http.put<Event>(environment.apiUrl + '/api/event/' + id, event);
  }

  getRegisteredUsers(eventId: number): Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/api/event/' + eventId + '/registeredUsers');
  }

  removeRegisteredUser(eventId: number, userId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/api/event/' + eventId + '/user/' + userId);
  }
}
