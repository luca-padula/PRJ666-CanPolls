import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { User } from 'src/data/Model/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id: string) : Observable<User> {
    return this.http.get<User>(environment.apiUrl + '/api/users/' + id);
  }
  saveUser(us : User) : Observable<any> {
    return this.http.put<any>(environment.apiUrl + '/api/users/' + us.userId, us);
  }
}
