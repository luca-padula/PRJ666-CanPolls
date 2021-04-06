import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptTokenService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  // ***Modified*** - from web422 angular jwt guide
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let newRequest = request.clone({
      setHeaders: {
        Authorization: `JWT ${this.auth.getToken()}`
      }
    });
    return next.handle(newRequest);
  }
  // ***End-Modified***
}
