import { Component, OnInit, EventEmitter } from '@angular/core';
import {Event} from '../../data/Model/Event';
import {User} from '../../data/Model/User';
import {Location} from '../../data/Model/Location';
import {EventService} from '../../data/services/event.service';
import {AuthService} from '../../data/services/auth.service';
import {UserService} from '../../data/services/user.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-submitted-event',
  templateUrl: './submitted-event.component.html',
  styleUrls: ['./submitted-event.component.css']
})
export class SubmittedEventComponent implements OnInit {
  private paramSubscription: any;
  private eventSubscription: any;
  private userSubscription: any;
  private locationSubscription: any;
  private eventId: number;
  currentTime: Date;
  registration: EventRegistration;
  getRegistrationSubscription: any;
  getRegistrationCountSubscription: any;
  userCanRegister: boolean = false;
  userCanCancel: boolean = false;
  userCanEdit: boolean = false;
  registerUserSubscription: any;
  cancelRegistrationSubscription: any;
  registrationSuccess: string;
  registrationFailure: string;
  currentEvent: Event;
  currentUser: User;
  currentLocation: Location;
  eventRegistrationCount: number;
  successMessage = false;  
  private token: any;
  src: any;
  base64data: any;
  b: String;
  constructor(
    private auth: AuthService,
    private eService: EventService,
    private uService: UserService,
    private route:ActivatedRoute,
<<<<<<< HEAD
    private sanitizer: DomSanitizer
=======
    private router: Router
>>>>>>> ac9bf11643c0f801474b94398ca2f5ad9495775d
    ) { }

  ngOnInit() {
    this.token = this.auth.readToken();
    this.currentTime = new Date();
    this.paramSubscription = this.route.params.subscribe((param)=>{
      this.eventId = param['id'];
    });
    this.eventSubscription = this.eService.getEventById(this.eventId).subscribe((data)=>{
      this.currentEvent=data;
      console.log(this.currentEvent.photo);
      //this.uploadImage(this.currentEvent.photo)
    
    this.locationSubscription= this.eService.getLocationByEventId(this.currentEvent.event_id).subscribe((data)=>{
      this.currentLocation = data;
    }, (err)=>{
      console.log(err);
    });
     
      if (this.auth.isAuthenticated()) {
        this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((data)=>{
          this.currentUser=data;
        });
        this.getRegistrationSubscription = this.eService.getRegistration(this.eventId, this.token.userId).subscribe((result) => {
          this.registration = result;
          this.getRegistrationCountSubscription = this.eService.getRegistrationCount(this.eventId).subscribe((result) => {
            this.eventRegistrationCount = result;
            let registrationDeadline: Date = new Date(this.currentEvent.date_from + ' ' + this.currentEvent.time_from);
            this.userCanEdit = this.token.userId == this.currentEvent.UserUserId
              && this.currentTime < registrationDeadline;
            this.userCanCancel = this.registration && this.registration.status == 'registered'
              && this.currentTime < registrationDeadline;
            registrationDeadline.setHours(registrationDeadline.getHours() - 12);
            this.userCanRegister = this.token.userId != this.currentEvent.UserUserId
              && this.currentTime < registrationDeadline
              && !this.registration;
            if (this.userCanRegister && this.currentEvent.attendee_limit != 0) {
              this.userCanRegister = this.eventRegistrationCount < this.currentEvent.attendee_limit;
            }
          }, (err) => {
            console.log(err);
          });
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => {
      console.log(err);
    });
  }
 /*uploadImage(data: Blob){
   var b = new Blob([data], {type: data.type});
  //const file: File = new File([data], "image.png");
    let objectURL = window.URL.createObjectURL(b);
    console.log(objectURL);       
    this.src = this.sanitizer.bypassSecurityTrustUrl(objectURL);
    console.log(this.src); 
      //this.uploadImage(this.currentEvent.photo);
    
    //const reader = new FileReader();
    //var base64data: string | String;
    /*reader.addEventListener('load', ()=> {
      debugger;
      this.b = reader.result as String;  
      this.b = this.b.split(',')[1];
      console.log(this.b);
      this.src = this.sanitizer.bypassSecurityTrustUrl('data:image/*;base64,' + this.b);   
    });
    
    reader.readAsDataURL(data);
    console.log(this.src);
    
    //this.b = base64data.split(',')[1];
    //console.log(this.b);
    //base64data = base64data.substr(base64data.indexOf(',') + 1)
    //this.src.src = 'data:image/bmp;base64,'+ Base64.encode(data);
}*/
  registerUser(): void {
    this.registerUserSubscription = this.eService.registerUserForEvent(this.eventId, this.token.userId).subscribe((success) => {
      this.registrationSuccess = success.message;
      this.userCanRegister = false;
      setTimeout(() => this.registrationSuccess = null, 4000);
    }, (err) => {
      console.log(err);
      this.registrationFailure = err.error.message;
    })
  }

  cancelRegistration(): void {
    this.cancelRegistrationSubscription = this.eService.cancelRegistration(this.eventId, this.token.userId).subscribe((success) => {
      this.registrationSuccess = success.message;
      this.registration.status = '';
      this.userCanCancel = false;
      setTimeout(() => {
        this.registrationSuccess = null;
        this.registration.status = 'cancelled';
      }, 4000);
    }, (err) => {
      console.log(err);
      this.registrationFailure = err.error.message;
    })
  }

  routeEventEdit(eId: number): void {
    this.router.navigate(['/event', eId, 'edit']);
  }

  approve(){
    this.auth.sendRespondEmail(this.currentEvent.event_id, this.currentUser.userId, true).subscribe((success)=>{
      this.successMessage = true;
    }, (err)=>{
      console.log(err);
    })
  }
  decline(){
    this.auth.sendRespondEmail(this.currentEvent.event_id, this.currentUser.userId, false).subscribe((success)=>{
      this.successMessage = true;
    }, (err)=>{
      console.log(err);
    })
  }
  ngOnDestroy(){
    if(this.paramSubscription){this.paramSubscription.unsubscribe();}
    if(this.eventSubscription){this.eventSubscription.unsubscribe();}
    if(this.userSubscription){this.userSubscription.unsubscribe();}
    if(this.locationSubscription){this.locationSubscription.unsubscribe();}
    if(this.getRegistrationSubscription){this.getRegistrationSubscription.unsubscribe();}
    if(this.getRegistrationCountSubscription){this.getRegistrationCountSubscription.unsubscribe();}
    if(this.registerUserSubscription){this.registerUserSubscription.unsubscribe();}
    if(this.cancelRegistrationSubscription){this.cancelRegistrationSubscription.unsubscribe();}
  }
}
