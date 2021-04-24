import { Component, OnInit, EventEmitter, DebugElement } from '@angular/core';
import {Event} from '../../data/Model/Event';
import {EventWithUserObj} from '../../data/Model/EventWithUserObj';
import {User} from '../../data/Model/User';
import {Location} from '../../data/Model/Location';
import {FeedbackDisplay} from '../../data/Model/FeedbackDisplay';
import {Feedback} from '../../data/Model/Feedback';
import {EventService} from '../../data/services/event.service';
import {AuthService} from '../../data/services/auth.service';
import {UserService} from '../../data/services/user.service';
import {AdminService} from '../../data/services/admin.service';
import { Router } from '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { EventRegistration } from 'src/data/Model/EventRegistration';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FeedbackComponent } from '../feedback/feedback.component';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-submitted-event',
  templateUrl: './submitted-event.component.html',
  styleUrls: ['./submitted-event.component.css']
})
export class SubmittedEventComponent implements OnInit {
  private paramSubscription: any;
  private eventSubscription: any;
  private locationSubscription: any;
  private feedbackSubscription: any;
  private eventId: number;

  currentTime: Date;
  registration: EventRegistration;
  getRegistrationAndCountSubscription: any;
  userCanRegister: boolean = false;
  userCanCancel: boolean = false;
  userCanEdit: boolean = false;
  registerUserSubscription: any;
  cancelRegistrationSubscription: any;
  registrationSuccess: string;
  registrationFailure: string;
  cancellationSuccess: string;
  cancellationFailure: string;
  currentEvent: EventWithUserObj = new EventWithUserObj();
  currentLocation: Location = new Location();
  eventRegistrationCount: number;
  successStatus: boolean;  
  message: string;
  messageP: string;
  private token: any;
  src: any;
  base64data: any;
  b: String;
  feedbacks: FeedbackDisplay[];
  givenFeedback : boolean = false;
  isExpired : boolean = false;
  starList: any[] = new Array(5);
  imageToShow:any;
  description: string="";
  rating:number=0;
  public fd : Feedback;
  success:boolean = false;
  att_limit: string;
  isAd: boolean = false;
  isCreator: boolean = false;
  timeP: boolean = false;

  constructor(
    private auth: AuthService,
    private eService: EventService,
    private uService: UserService,
    private aService: AdminService,
    private route:ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
    ) {    }

  ngOnInit() {

    this.token = this.auth.readToken();
    this.currentTime = new Date();
    this.paramSubscription = this.route.params.subscribe((param)=>{
      this.eventId = param['id'];
    });
    this.eventSubscription = this.eService.getEventById(this.eventId).subscribe((data)=>{
      this.currentEvent=data;
      let endDate: Date = new Date(this.currentEvent.date_from + ' ' + this.currentEvent.time_to);
      if(this.currentEvent.status=="P" || this.currentEvent.status=="C"){        
        if((this.token.isAdmin && this.token.partyAffiliation == this.currentEvent.User.partyAffiliation) || this.token.userId == this.currentEvent.UserUserId){
          this.successStatus = true;
          if(this.token.isAdmin && this.token.partyAffiliation == this.currentEvent.User.partyAffiliation ){
            this.isAd = true;
          } 
          else{
            this.isCreator = true;
          }          
          if(this.currentEvent.attendee_limit == 0){
            this.att_limit = "Unlimited attendee";
          }
          else{
            this.att_limit = this.currentEvent.attendee_limit.toString();
          }
          this.retrieveImage();
        this.locationSubscription= this.eService.getLocationByEventId(this.currentEvent.event_id).subscribe((data)=>{
          this.currentLocation = data;
        }, (err)=>{
          console.log(err);
        });
        }
        else{
          this.isAd = false;
          this.isCreator = false;          
          this.router.navigate(['/notAvailable']);
        }
      }
      else if(this.currentEvent.status == "D"){        
        if(this.currentEvent.UserUserId == this.token.userId || (this.token.isAdmin && this.token.partyAffiliation == this.currentEvent.User.partyAffiliation )){
          this.successStatus = true;
        if(this.currentEvent.attendee_limit == 0){
          this.att_limit = "Unlimited attendee";
        }
        else{
          this.att_limit = this.currentEvent.attendee_limit.toString();
        }
        this.retrieveImage();
      this.locationSubscription= this.eService.getLocationByEventId(this.currentEvent.event_id).subscribe((data)=>{
        this.currentLocation = data;
      });
      if(this.token.isAdmin && this.token.partyAffiliation == this.currentEvent.User.partyAffiliation ){
        
        this.isAd = true;
        let eDate = new Date();
        console.log(endDate.getDate()-2);
        eDate.setDate(endDate.getDate()-2);
        console.log(eDate);
        if(this.currentTime < eDate){ 
        this.messageP = "This event has been declined by you. But you can still change your mind.";
        this.timeP = false;
        }
        else{
          this.messageP = "Sorry! This event has been declined and It passed the valid time to change the status."
          this.timeP = true;
        }
      }
      else{
        this.isCreator = true;
      }
    }else{
      this.router.navigate(['/notAvailable']);
    }
      }
      else{
        this.successStatus=true;        
        if(this.currentEvent.attendee_limit == 0){
          this.att_limit = "Unlimited attendee";
        }
        else{
          this.att_limit = this.currentEvent.attendee_limit.toString();
        }
        this.retrieveImage();
      this.locationSubscription= this.eService.getLocationByEventId(this.currentEvent.event_id).subscribe((data)=>{
        this.currentLocation = data;
      });
        if(endDate < this.currentTime){
          this.isExpired = true;
          this.feedbackSubscription = this.eService.getFeedbackByEventId(this.currentEvent.event_id).subscribe(data=>{
            this.feedbacks = data;            

            if(this.feedbacks.length>0){
              for(var i = 0; i<this.feedbacks.length; i++){
                console.log(this.feedbacks[i].User.userId);
                if(this.feedbacks[i].User.userId == this.token.userId){
                  this.givenFeedback = true;
                }
              }
              console.log("give Feedback: " +this.givenFeedback);
              }
          }); 
          
            
          
      }
    }
    // Determine which actions should be available to the user - edit, register, cancel, etc.
      if (this.auth.isAuthenticated()) {
        this.determineAvailableUserActions();        
      }

    }, (err) => {
      console.log(err);
    });

  }

  determineAvailableUserActions(): void {

    const registrationAndCount$ = forkJoin([
      this.eService.getRegistration(this.eventId, this.token.userId),
      this.eService.getRegistrationCount(this.eventId)
    ]);

    this.getRegistrationAndCountSubscription = registrationAndCount$
    .subscribe(([registration, count]) => {

      this.registration = registration;
      this.eventRegistrationCount = count;
      let registrationDeadline: Date = new Date(this.currentEvent.date_from + ' ' + this.currentEvent.time_from); 

      this.userCanEdit = this.token.userId == this.currentEvent.UserUserId
        && this.currentTime < registrationDeadline
        && this.currentEvent.status != 'C';

      this.userCanCancel = (this.registration != null) && this.registration.status == 'registered'
        && this.currentTime < registrationDeadline;

      registrationDeadline.setHours(registrationDeadline.getHours() - 12);

      this.userCanRegister = this.token.userId != this.currentEvent.UserUserId
        && this.currentTime < registrationDeadline
        && (this.registration == null);
        
      if (this.userCanRegister && this.currentEvent.attendee_limit != 0) {        
        this.userCanRegister = this.eventRegistrationCount < this.currentEvent.attendee_limit;
      }
    }, err => console.log(err));
  }
 
  // This function registers the logged in user for the current event
  registerUser(): void {
    this.registerUserSubscription = this.eService.registerUserForEvent(this.eventId, this.token.userId).subscribe((success) => {
      this.registrationSuccess = success.message;
      this.userCanRegister = false;
      this.userCanCancel = true;
      setTimeout(() => this.registrationSuccess = null, 4000);
    }, (err) => {
      console.log(err);
      this.registrationFailure = err.error.message;
      setTimeout(() => this.registrationFailure = null, 4000);
    })
  }

  // This function cancels the logged in user's registration for the current event
  cancelRegistration(): void {
    if (this.userCanCancel) {
      this.cancelRegistrationSubscription = this.eService.cancelRegistration(this.eventId, this.token.userId).subscribe((success) => {
        this.cancellationSuccess = success.message;
        this.registration.status = '';
        this.userCanCancel = false;
        setTimeout(() => {
          this.cancellationSuccess = null;
          this.registration.status = 'cancelled';
        }, 4000);
      }, (err) => {
        console.log(err);
        this.cancellationFailure = err.error.message;
      })
    }
  }

  // This function navigates to the edit page for the current event
  // ***Modified*** - from web422 angular assignment
  routeEventEdit(eId: number): void {
    this.router.navigate(['/event', eId, 'edit']);
  }
  // ***End-Modified***

    //RETRIEVE FROM API
    retrieveImage()
  {
    var getExt = this.currentEvent.photo;    
    this.http.get(environment.apiUrl + "/api/getimage/"+getExt,{responseType: 'blob'})
    .subscribe( result => {
       this.createImageFromBlob(result);
    },
    (err)=>{
      console.log(err);
    });
  }
//retrieve uses this function
createImageFromBlob(image: Blob) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
     this.imageToShow = reader.result;    
  }, false);

  if (image) {
     reader.readAsDataURL(image);
  }

}
openDialog(){
  let date = new Date();
  const dialogRef = this.dialog.open(FeedbackComponent, {
    data: {feedback_desc: this.description, feedback_rating: this.rating, eventEventId: this.currentEvent.event_id, userUserId: this.token.userId, feedback_date: date}
  });
  dialogRef.afterClosed().subscribe(result =>{
    this.fd = result;
    console.log(this.fd);
    if(this.fd){
    this.auth.createFeedback(this.fd).subscribe(success=>{
        this.success = true;
        console.log("feedback is saved");
        window.location.reload();
    },(err) => {
      console.log(err);
    });
    }
  })
}

approve(isApp: boolean){
    
  if(this.token.isAdmin){
    console.log(isApp);
    let adminParty = this.token.partyAffiliation;
    if(adminParty == this.currentEvent.User.partyAffiliation){
      this.currentEvent.status = isApp ? "A" : "D";
      this.aService.approveEvent(this.currentEvent.event_id, this.currentEvent).subscribe();
      this.message = "Event "+( (this.currentEvent.status.toString() == "A") ? "approved" : "declined")+". An email has been sent to the user.";
    }
    else
    {
      
      this.message = "You cannot alter other parties events!!";
    }
    debugger;
  }
}
  
  ngOnDestroy(){
    if(this.paramSubscription){this.paramSubscription.unsubscribe();}
    if(this.eventSubscription){this.eventSubscription.unsubscribe();}   
    if(this.locationSubscription){this.locationSubscription.unsubscribe();}
    if(this.getRegistrationAndCountSubscription){this.getRegistrationAndCountSubscription.unsubscribe();}
    if(this.registerUserSubscription){this.registerUserSubscription.unsubscribe();}
    if(this.cancelRegistrationSubscription){this.cancelRegistrationSubscription.unsubscribe();}
    if(this.feedbackSubscription){this.feedbackSubscription.unsubscribe();}
  }
}
