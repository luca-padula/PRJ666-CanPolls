import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import { EventService } from 'src/data/services/event.service';
import { Event } from 'src/data/Model/Event';
import { Location } from 'src/data/Model/Location';
import { User } from 'src/data/Model/User';
import { ValidationError } from 'src/data/Model/ValidationError';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  private token: any;
  eventId: number;
  event: Event;
  location: Location;
  registeredUsers: User[];
  paramSubscription: any;
  getEventSubscription: any;
  getLocationSubscription: any;
  getUsersSubscription: any;
  validationErrors: ValidationError[];
  successMessage: boolean;
  warning: string;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.token = this.auth.readToken();
    this.paramSubscription = this.route.params.subscribe((params) => {
      this.eventId = params['id'];
    }, (err) => {
      console.log('Unable to get route parameters', err);
    });
    this.getEventSubscription = this.eventService.getEventById(this.eventId).subscribe((result) => {
      this.event = result;
    }, (err) => {
      console.log('Unable to get event', err);
    });
    this.location = new Location;
    this.getUsersSubscription = this.eventService.getRegisteredUsers(this.eventId).subscribe((results) => {
      this.registeredUsers = results;
      console.log(this.registeredUsers);
    }, (err) => {
      console.log('Unable to get registered users', err);
    });
  }

  ngOnDestroy() {
    if (this.paramSubscription)
      this.paramSubscription.unsubscribe();
    if (this.getEventSubscription)
      this.getEventSubscription.unsubscribe();
    if (this.getLocationSubscription)
      this.getLocationSubscription.unsubscribe();
    if (this.getUsersSubscription)
      this.getUsersSubscription.unsubscribe();
  }
}
