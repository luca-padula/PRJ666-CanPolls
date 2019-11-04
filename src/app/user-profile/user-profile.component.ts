import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { Event } from 'src/data/Model/Event';
import { UserService } from '../../data/services/user.service'
import { EventService } from '../../data/services/event.service'
import { AuthService } from 'src/data/services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidationError } from 'src/data/Model/ValidationError';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 
  private token: any;
  private userSubscription: any;
  private eventSubscription: any;
  currentUser: User;
  validationErrors: ValidationError[];
  userSubmittedEvents: any[];
  successMessage: boolean;
  warning: String;
  isEditEnable : boolean = true;

  constructor(private auth: AuthService, private uService: UserService, private eService: EventService, private router: Router){ }
  ngOnInit() {
      this.token = this.auth.readToken();
      this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((us) => {
        this.currentUser = us;
      });
      this.eService.getAllEventsByUser(this.token.userId).subscribe(data => {
        console.log(data);
        this.userSubmittedEvents = data;
      });
   }

  onEdit(){
    this.isEditEnable =!this.isEditEnable;
  }

  routeEvent(eventId: number): void {
    this.router.navigate(['/event', eventId, 'edit']);
  }

  ngOnDestroy(){ 
      if(this.userSubscription){this.userSubscription.unsubscribe();}
      if(this.eventSubscription){this.eventSubscription.unsubscribe();}
  }

  onSubmit(f: NgForm): void {
    this.uService.updateUserInfo(this.currentUser).subscribe((success) => {
      this.warning = null;
      this.successMessage = true;
      setTimeout(()=>{
        this.successMessage = false;
      },2500);
    }, (err) => {
      console.log(err);
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
        setTimeout(()=>{
          this.validationErrors = null;
        },2500);
      }
      else {
        this.warning = err.error.message;
        setTimeout(()=>{
          this.warning = "";
        },2500);
      }
    });
  }
 
}