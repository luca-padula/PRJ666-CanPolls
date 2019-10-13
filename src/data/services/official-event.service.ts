import { Injectable } from '@angular/core';
import {OfficialEvent} from '../Model/OfficialEvent'
import {HttpClient,HttpHeaders} from '@angular/common/http'
import {Observable, of} from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class OfficialEventService {

  ofEvent : OfficialEvent[] 

  private apiURL = 'localhost:3000/api/officialEvent'
  getOfficialEvents():Observable<OfficialEvent[]>
  {
   
    return this.http.get<OfficialEvent[]>(this.apiURL);
      
    
  }

  constructor(private http:HttpClient) { }
 

}

