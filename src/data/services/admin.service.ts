import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { User } from 'src/data/Model/User';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }


  getAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(environment.apiUrl + '/api/users');
  }

  updUserAccStatus(us : User) : Observable<any> {
   // console.log(status+userID);
    return this.http.put<any>(environment.apiUrl + '/api/updateAccountStatus/:userId' + us.userId, us);
  }

}
