import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import { EventService } from 'src/data/services/event.service';
import { Event } from 'src/data/Model/Event';
import { Location } from 'src/data/Model/Location'
import { EventRegistration } from 'src/data/Model/EventRegistration';
import { EventRegistrationWithUser } from 'src/data/Model/EventRegistrationWithUser';
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
  registrations: EventRegistrationWithUser[];
  filteredRegistrations: EventRegistrationWithUser[];
  paramSubscription: any;
  getEventSubscription: any;
  updateEventSubscription: any;
  getLocationSubscription: any;
  updateLocationSubscription: any;
  getRegistrationsSubscription: any;
  removeUserSubscription: any;
  validationErrors: ValidationError[];
  successMessage: string;
  warning: string;
  removeUserSuccess: string;
  removeUserWarning: string;

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
    this.getRegistrationsSubscription = this.eventService.getRegistrationsWithUsersByEventId(this.eventId).subscribe((results) => {
      this.registrations = results;
      this.filteredRegistrations = this.registrations.filter((reg) => reg.status == 'registered');
    }, (err) => {
      console.log('Unable to get registrations', err);
    });
  }

  onEventSubmit(f: NgForm): void {
    this.validationErrors = [];
    this.updateEventSubscription = this.eventService.updateEventById(this.eventId, this.event).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to update event', err);
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
    });
  }

  onLocationSubmit(f: NgForm): void {
    this.validationErrors = [];
    this.updateLocationSubscription = this.eventService.updateLocationById(this.eventId, this.location).subscribe((success) => {
      this.successMessage = success.message;
      setTimeout(() => this.successMessage = null, 4000);
    }, (err) => {
      console.log('Unable to update event', err);
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
    });
  }

  removeRegisteredUser(userId: number): void {
    this.removeUserSubscription = this.eventService.removeRegisteredUser(this.eventId, userId).subscribe((success) => {
      this.removeUserSuccess = success.message;
      setTimeout(() => this.removeUserSuccess = null, 4000);
    }, (err) => {
      console.log('Unable to remove user', err);
      this.removeUserWarning = err.message;
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
    if (this.removeUserSubscription)
      this.removeUserSubscription.unsubscribe();
  }
}
