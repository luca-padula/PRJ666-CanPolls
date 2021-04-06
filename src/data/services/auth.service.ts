import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../Model/Feedback';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from 'src/data/Model/User';
import { UserToRegister } from '../Model/UserToRegister';
import {EventToCreate} from '../Model/EventToCreate';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ***Modified*** - from web422 angular jwt guide
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  // This function returns the access token from local storage
  public getToken(): string {
    return localStorage.getItem('access_token');
  }

  // This function returns the access token decoded from local storage
  public readToken(): any {
    const token = localStorage.getItem('access_token');
    return this.jwtHelper.decodeToken(token);
  }

  // This function checks if the user is logged in
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (token) {
      console.log('token exists');
      return true;
    }
    else {
      console.log('no token');
      return false;
    }
  }

  // This function takes a user object and authenticates the user
  login(user: User): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/login', user);
  }
  // ***End-Modified***

  // This function takes data from a user registration form and registers the user to the database
  register(user: UserToRegister): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/register', user);
  }

  // This function takes a user object sends the user a new account verification email
  resendVerificationEmail(user: User): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/resendVerificationEmail', user);
  }

  // This function takes a user id and a token for a verification hash and verifies the user's account
  verifyUser(id: string, token: string): Observable<any> {
    let apiUrl: string = environment.apiUrl + '/api/verifyEmail/' + id + '/' + token;
    return this.http.post<any>(apiUrl, {});
  }

  // This functions logs the user out
  logout(): void {
    localStorage.clear();
  }

  // This function takes a user's email and sends that user a password reset email
  sendPasswordResetEmail(email: string): Observable<any> {
    return this.http.post<any>(environment.apiUrl + '/api/forgotPassword', { email: email });
  }

  // This function takes a user id, a password reset token, and new password data
  // and resets the user's password
  resetPassword(id: string, token: string, password: string, password2: string): Observable<any> {
    let body = {
      password: password,
      password2: password2
    };
    let apiUrl: string = environment.apiUrl + '/api/resetPassword/' + id + '/' + token;
    return this.http.post<any>(apiUrl, body);
  }

  createEvent(eventToCreate: EventToCreate): Observable<any>{
    return this.http.post<any>(environment.apiUrl + '/api/createEvent', eventToCreate);
  }

  sendRespondEmail(id: number, userId: string, isApproved: string): Observable<any>{
    let body = {
      userId: userId,
      isApproved: isApproved
    };
    console.log(id + " ," + userId + "," + isApproved);
    let apiUrl: string = environment.apiUrl + '/api/updateEventStatus/' + id;
    return this.http.post<any>(apiUrl, body);
  }
  createFeedback(feedback: Feedback):Observable<any>{
    return this.http.post<any>(environment.apiUrl + '/api/createFeedback', feedback);
  }
}
