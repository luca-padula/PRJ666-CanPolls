import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {EventToCreate} from 'src/data/Model/EventToCreate';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEventById(id: number) : Observable<Event>{
    return this.http.get<Event>(environment.apiUrl + '/api/event/' + id);
  }
}
