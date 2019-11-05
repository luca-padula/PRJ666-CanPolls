import { Component, OnInit, EventEmitter } from '@angular/core';
import {Event} from '../../data/Model/Event';
import {User} from '../../data/Model/User';
import {EventService} from '../../data/services/event.service';
import {AuthService} from '../../data/services/auth.service';
import {UserService} from '../../data/services/user.service';
import {ActivatedRoute} from '@angular/router';
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
  currentEvent: Event;
  currentUser: User;
  successMessage = false;  
  private token: any;
  constructor(private auth: AuthService, private eService: EventService, private uService: UserService, private r:ActivatedRoute) { }

  ngOnInit() {
    this.paramSubscription = this.r.params.subscribe((param)=>{
      this.eventSubscription = this.eService.getEventById(param['id']).subscribe((data)=>{
        this.currentEvent=data["event"];
        console.log(this.currentEvent.event_title);
        this.token = this.auth.readToken();
        this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((data)=>{
          this.currentUser=data;
          console.log(this.currentUser.email);
        })
      });
      
    })
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
  }
}
