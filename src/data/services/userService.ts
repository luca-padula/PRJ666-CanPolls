import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';

import { User } from '../Model/User';

@Injectable()
export class EmployeeService {


  constructor(private http: HttpClient) { }

 /* saveUser(user : User) : Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/users/login', user);
    ("https://web422-teamsdata-harora.herokuapp.com/employee/" + user.userId, user);
  }
*/
  getUserById(id) : Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/users/login' + id);
  }
}