import { Component, OnInit, EventEmitter } from '@angular/core';
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
  cancellationSuccess: string;
  cancellationFailure: string;
  currentEvent: EventWithUserObj = new EventWithUserObj();
  currentUser: User = new User();
  currentLocation: Location = new Location();
  eventRegistrationCount: number;
  successStatus: boolean = false;  
  message: string;
  private token: any;
  src: any;
  base64data: any;
  b: String;
  feedbacks: FeedbackDisplay[];
  givenFeedback : boolean = false;
  isExpired : boolean = false;
  starList: any[] = new Array(5);
  imageToShow:any;
  description: string;
  rating:number;
  public fd : Feedback;
  success:boolean = false;
  att_limit: string;
  

  constructor(
    private auth: AuthService,
    private eService: EventService,
    private uService: UserService,
    private aService: AdminService,
    private route:ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
    ) {   this.token = this.auth.readToken(); }

  ngOnInit() {
  
    this.currentTime = new Date();
    this.paramSubscription = this.route.params.subscribe((param)=>{
      this.eventId = param['id'];
    });
    this.eventSubscription = this.eService.getEventById(this.eventId).subscribe((data)=>{
      this.currentEvent=data;
      //this.uploadImage(this.currentEvent.photo)
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
    let endDate: Date = new Date(this.currentEvent.date_from + ' ' + this.currentEvent.time_to);
        if(endDate < this.currentTime){
          this.isExpired = true;
          this.eService.getFeedbackByEventId(this.currentEvent.event_id).subscribe(data=>{
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

  routeEventEdit(eId: number): void {
    this.router.navigate(['/event', eId, 'edit']);
  }

    //RETRIEVE FROM API
    retrieveImage()
  {
    var getExt = this.currentEvent.photo;
    getExt = getExt.substring(getExt.lastIndexOf('.'));
    var fullImgName = this.eventId+"Event"+this.currentEvent.UserUserId+""+getExt;
    console.log("Retrieve : "+fullImgName);
    this.http.get(environment.apiUrl + "/api/getimage/"+fullImgName,{responseType: 'blob'})
    .subscribe( result => {
       this.createImageFromBlob(result);
    });
  }
  
//retrieve uses this function
createImageFromBlob(image: Blob) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
     this.imageToShow = reader.result;
    // console.log("imagetoshow: "+this.imageToShow);
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
    });
    }
  })
}

  approve(isApp: boolean){
    
    /*if(this.token.isAdmin){
      console.log(isApp);
      let adminParty = this.token.partyAffiliation;
      if(adminParty == this.currentEvent.User.partyAffiliation){
        this.currentEvent.status = isApp;
        this.aService.approveEvent(this.currentEvent.event_id, this.currentEvent).subscribe();
        this.successStatus = true;
        this.message = "Event "+( (this.currentEvent.isApproved.toString() == "true") ? "approved" : "declined")+". An email has been sent to the user.";
      }
      else
      {
        
        this.message = "You cannot alter other parties events!!";
      }
    }*/
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
