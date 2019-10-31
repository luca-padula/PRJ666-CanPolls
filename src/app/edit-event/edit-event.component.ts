import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import { EventService } from 'src/data/services/event.service';
import { Event } from 'src/data/Model/Event';
import { Location } from 'src/data/Model/Location'
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { User } from 'src/data/Model/User';
import { ValidationError } from 'src/data/Model/ValidationError';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit {

  private token: any;
  userCanEdit: boolean;
  loading: boolean = true;
  eventId: number;
  event: Event;
  location: Location;
  eventRegistrations: EventRegistration[];
  registeredUsers: User[];
  paramSubscription: any;
  getEventSubscription: any;
  updateEventSubscription: any;
  getLocationSubscription: any;
  updateLocationSubscription: any;
  getRegistrationsSubscription: any;
  getUsersSubscription: any;
  removeUserSubscription: any;
  validationErrors: ValidationError[];
  successMessage: string;
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
      let now = new Date();
      let eventStartTime = new Date(result.date_from);
      this.userCanEdit = (this.token.userId == result.UserUserId && now < eventStartTime);
      this.event = result;
      this.loading = false;
    }, (err) => {
      this.loading = false;
      console.log('Unable to get event', err);
    });
    this.getLocationSubscription = this.eventService.getLocationByEventId(this.eventId).subscribe((result) => {
      this.location = result;
    }, (err) => {
      console.log('Unable to get location', err);
    });
    this.getRegistrationsSubscription = this.eventService.getRegistrationsByEventId(this.eventId).subscribe((results) => {
      this.eventRegistrations = results.filter((item, index, array) => {
        return item.status != 'removed';
      });
    }, (err) => {
      console.log('Unable to get registrations', err);
    });
    this.getUsersSubscription = this.eventService.getRegisteredUsers(this.eventId).subscribe((results) => {
      this.registeredUsers = results;
    }, (err) => {
      console.log('Unable to get registered users', err);
    });
  }

  onEventSubmit(f: NgForm): void {
    this.updateEventSubscription = this.eventService.updateEventById(this.eventId, this.event).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to update event', err);
    });
  }

  onLocationSubmit(f: NgForm): void {
    this.updateLocationSubscription = this.eventService.updateLocationById(this.eventId, this.location).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to update event', err);
    });
  }

  removeRegisteredUser(userId: number): void {
    this.removeUserSubscription = this.eventService.removeRegisteredUser(this.eventId, userId).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to remove user', err);
    });
  }

  ngOnDestroy() {
    if (this.paramSubscription)
      this.paramSubscription.unsubscribe();
    if (this.getEventSubscription)
      this.getEventSubscription.unsubscribe();
    if (this.updateEventSubscription)
      this.updateEventSubscription.unsubscribe();
    if (this.getLocationSubscription)
      this.getLocationSubscription.unsubscribe();
    if (this.updateLocationSubscription)
      this.updateLocationSubscription.unsubscribe();
    if (this.getRegistrationsSubscription)
      this.getRegistrationsSubscription.unsubscribe();
    if (this.getUsersSubscription)
      this.getUsersSubscription.unsubscribe();
    if (this.removeUserSubscription)
      this.removeUserSubscription.unsubscribe();
  }
}
