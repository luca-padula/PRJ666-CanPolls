import { Component, OnInit, EventEmitter } from '@angular/core';
import {EventToCreate} from '../../data/Model/EventToCreate';

@Component({
  selector: 'app-submitted-event',
  templateUrl: './submitted-event.component.html',
  styleUrls: ['./submitted-event.component.css']
})
export class SubmittedEventComponent implements OnInit {
  
  event: EventToCreate = new EventToCreate({
    event_id: 12345,
    event_title: "Event Title",
    event_description: "This is description",
    date_to: "09/09/2019",
    date_from: "09/10/2019",
    time_from: "09:12 AM",
    time_to: "09:12 PM",
    attendee_limit: 12,
      venue_name: "Venue name",
      street_name: "123 Name",
      city: "Toronto",
      province:"Ontario",
      postal_code:"123mma"
  });


  constructor() { }

  ngOnInit() {
  }

}
