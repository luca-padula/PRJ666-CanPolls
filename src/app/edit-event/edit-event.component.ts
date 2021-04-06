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
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';

declare var $: any;

class ImageSnippet{
  constructor(public src: String, public file: File){}
}
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
  event: Event = new Event();
  location: Location = new Location();
  registrations: EventRegistrationWithUser[] = [];
  filteredRegistrations: EventRegistrationWithUser[] = [];
  registeredCount: number;
  selectedRegistration: EventRegistrationWithUser = new EventRegistrationWithUser();
  paramSubscription: any;
  getEventSubscription: any;
  updateEventSubscription: any;
  getLocationSubscription: any;
  updateLocationSubscription: any;
  getRegistrationsSubscription: any;
  removeUserSubscription: any;
  validationErrors: ValidationError[] = [];
  successMessage: string;
  warning: string;
  removeUserSuccess: string;
  removeUserWarning: string;
  cancelReason: string;
  cancelEventSuccess: string;
  cancelEventWarning: string;

  userFilters = [
    {key: 'partyAffiliation', value: 'Unaffiliated', filtering: false},
    {key: 'partyAffiliation', value: 'Liberal', filtering: false},
    {key: 'partyAffiliation', value: 'Conservative', filtering: false},
    {key: 'partyAffiliation', value: 'NDP', filtering: false},
    {key: 'partyAffiliation', value: 'Green', filtering: false},
    {key: 'partyAffiliation', value: 'Bloc Quebecois', filtering: false}
  ];
  registrationFilters = [
    {key: 'status', value: 'registered', filtering: true},
    {key: 'status', value: 'cancelled', filtering: false},
    {key: 'status', value: 'removed', filtering: false}
  ]

  selectedFile: ImageSnippet;
  sfile : File = null;

  imageToShow:any;

  selectedF: File =null;
  fd =new FormData();

  fullImageName :string="";


  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private eventService: EventService,
    private http: HttpClient
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
      let eventStartTime = new Date(result.date_from + ' ' + result.time_from);
      this.event = result;
      this.userCanEdit = (this.token.userId == this.event.UserUserId && now < eventStartTime && this.event.status != 'C');
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
      this.registeredCount = this.filteredRegistrations.length;
    }, (err) => {
      console.log('Unable to get registrations', err);
    });
  }

  // This function returns a count of the number of registrations that meet a filter criteria
  getFilterCount(filterKey: string, filtervalue: any, onUser: boolean): number {
    if (onUser) {
      return this.registrations.filter((reg) => reg.User[filterKey].toLowerCase() == filtervalue.toLowerCase()).length;
    }
    return this.registrations.filter((reg) => reg[filterKey].toLowerCase() == filtervalue.toLowerCase()).length;
  }

  // This function filters the registrations table with the selected filters
  applyFilters(): void {
    this.filteredRegistrations = this.registrations.filter((reg) => {
      let atLeast1Filter: boolean = false;
      // ***Modified*** - from stackoverflow filtering question
      for (let filter of this.userFilters) {
        if (filter.filtering) {
          atLeast1Filter = true;
          if (reg.User[filter.key].toLowerCase() == filter.value.toLowerCase()) {
            return true;
          }
        }
      }
      if (!atLeast1Filter) {
        return true;
      }
      return false;
      // ***End-Modified***
    }).filter((reg) => {
      let atLeast1Filter: boolean = false;
      // ***Modified*** - from stackoverflow filtering question
      for (let filter of this.registrationFilters) {
        if (filter.filtering) {
          atLeast1Filter = true;
          if (reg[filter.key].toLowerCase() == filter.value.toLowerCase()) {
            return true;
          }
        }
      }
      if (!atLeast1Filter) {
        return true;
      }
      return false;
    });
    // ***End-Modified***
  }

  // This function updates the event data
  onEventSubmit(f: NgForm): void {
    this.validationErrors = [];
    this.warning = null;
    this.http.post(environment.apiUrl + "/api/upload", this.fd)
    .subscribe( result => {
    console.log("Result: "+result)
    });
    if (this.fullImageName) {
      this.event.photo = this.fullImageName;
    }
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

  // This function updates the location data
  onLocationSubmit(f: NgForm): void {
    this.validationErrors = [];
    this.warning = null;
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

  // This function triggers the modal to confirm cancellation of the event
  onCancelClick(): void {
    this.cancelReason = '';
    this.cancelEventWarning = null;
    $('#cancelEventModal').modal();
  }

  // This function cancels the event
  onCancelSubmit(f: NgForm): void {
    this.cancelEventWarning = null;
    this.cancelReason = this.cancelReason.trim();
    let validInput: boolean = !this.cancelReason.match(/[^a-zA-Z\d.,' ]/) && !this.cancelReason.match(/[ ]{2,}/);
    if (validInput) {
      this.eventService.cancelEvent(this.eventId, this.cancelReason).subscribe((success) => {
        this.event.status = 'C';
        this.cancelEventSuccess = success.message;
        this.userCanEdit = false;
      }, (err) => {
        console.log('Unable to remove user', err);
        this.cancelEventWarning = err.error.message;
      });
    }
    else {
      this.cancelEventWarning = 'Invalid input entered for cancellation reason';
    }
  }

  // This function triggers the modal to confirm removal of a registered user
  onSelectForRemoval(reg: EventRegistrationWithUser): void {
    this.selectedRegistration = reg;
    $('#removeUserModal').modal();
  }

  // This function takes a user id and removed that user from the event registration
  removeRegisteredUser(userId: number): void {
    if (this.selectedRegistration.status == 'registered') {
      this.removeUserSubscription = this.eventService.removeRegisteredUser(this.eventId, userId).subscribe((success) => {
        this.selectedRegistration.status = 'removed';
        let idx = this.registrations.findIndex((reg) => reg.UserUserId == userId.toString());
        this.registrations[idx] = this.selectedRegistration;
        this.applyFilters();
        this.removeUserSuccess = success.message;
      }, (err) => {
        console.log('Unable to remove user', err);
        this.removeUserWarning = err.error.message;
      });
    }
  }

   //SENDING THE IMAGE TO THE API
   onImageAdd(event)
   {
     const file: File = <File>event.target.files[0];
     this.sfile = file;
     const reader = new FileReader();
     reader.addEventListener('load', (event:any) =>{
       this.selectedFile = new ImageSnippet(event.target.result, file);
     });
     reader.readAsDataURL(file);
     
     this.selectedF = <File>event.target.files[0];
     var fileName = this.selectedF.name;
     fileName = fileName.substring(fileName.lastIndexOf('.'));
     this.fullImageName = "Event"+this.token.userId+fileName;
     this.fd.append('file', this.selectedF, this.fullImageName);

     console.log("imageAdded: "+this.fullImageName);
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
