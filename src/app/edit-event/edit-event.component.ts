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
  userCanEdit: boolean;
  loading: boolean = true;
  eventId: number;
  event: Event;
  location: Location;
  registeredUsers: User[];
  paramSubscription: any;
  getEventSubscription: any;
  updateEventSubscription: any;
  getLocationSubscription: any;
  updateLocationSubscription: any;
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
    this.location = new Location;
    this.getUsersSubscription = this.eventService.getRegisteredUsers(this.eventId).subscribe((results) => {
      this.registeredUsers = results;
      console.log(this.registeredUsers);
    }, (err) => {
      console.log('Unable to get registered users', err);
    });
  }

  onSubmit(f: NgForm): void {
    this.updateEventSubscription = this.eventService.updateEventById(this.eventId, this.event).subscribe((success) => {
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
    if (this.getUsersSubscription)
      this.getUsersSubscription.unsubscribe();
    if (this.removeUserSubscription)
      this.removeUserSubscription.unsubscribe();
  }
}
