import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import {EventService} from 'src/data/services/event.service';
import { User } from 'src/data/Model/User';
import {MatDialog, MatDialogConfig} from '@angular/material';
import { FeedbackComponent } from '../feedback/feedback.component';
import {Event} from 'src/data/Model/Event';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;
  public warning: string;
  public successMessage: boolean = false;
  public userNotVerified: boolean = false;
  public unverifiedUser: string;
  public rejectionCount: number = 0;
  public success: boolean = false;
  attendedEvents: Event[];
  public event: Event;
  description: string;
  rating:number;
  currentDate = new Date();
  constructor(
    private auth: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private eService: EventService
  ) { }

  ngOnInit() {
    this.user = new User;
  }

  onSubmit(f: NgForm): void {
    this.userNotVerified = false;
    this.auth.login(this.user).subscribe((success) => {
      localStorage.setItem('access_token', success.token);
      this.router.navigate(['/home']);
      this.eService.getEventsAttendedByUser(+this.user.userId).subscribe(data => {
        console.log(data);
        this.attendedEvents = data;
        if(this.attendedEvents.length > 0){
          for(let event of this.attendedEvents){
            console.log(event);
            let endDate: Date = new Date(event.date_to + ' ' + event.time_to);
            if(endDate < this.currentDate){
              this.openDialog(event.event_id, this.user.userId);
            }
          }
        }
      });
      
    }, (err) => {
      this.rejectionCount++;
      if (this.rejectionCount >= 5) {
        this.router.navigate(['/forgotPassword']);
      }
      this.warning = err.error.message;
      if (this.warning == 'You need to verify your account before you can log in. Check your email for the link.') {
        this.userNotVerified = true;
        this.unverifiedUser = this.user.userName
      }
    });
  }

  resendVerificationEmail(p_user: User): void {
    this.userNotVerified = false
    p_user.userName = this.unverifiedUser;
    this.auth.resendVerificationEmail(p_user).subscribe((success) => {
      this.successMessage = true;
      setTimeout(() => this.successMessage = false, 4000);
    }, (err) => {
      console.log(err);
    });
  }

  openDialog(event_id: number, userId: string){
    const dialogRef = this.dialog.open(FeedbackComponent, {
      data: {description: this.description, rating: this.rating, eventId: event_id, userId: userId}
    });
    dialogRef.afterClosed().subscribe(result =>{
      console.log(result);
      this.eService.createFeedback(result).subscribe(success=>{
          this.success = true;
          console.log("feedback is saved");
      })
    })
  }

}
