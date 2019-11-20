import { Component, OnInit } from '@angular/core';
import {Event} from '../../data/Model/Event';

import {EventService} from '../../data/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[];
  getEventsSub: any;
  
  
  loadingError: boolean = false;
  provinces = [
    {name: "", value: ""},
    {name:"British Columbia", value: "BC"},
    {name:"Alberta", value: "AB"},
    {name:"Manitoba", value:"MN"},
    {name:"Saskatchewan", value:"SK"},
    {name:"Ontario", value:"ON"},
    {name:"Quebec", value:"QC"},
    {name:"New Brunswick", value:"NB"},
    {name:"Nova Scotia", value:"NS"},
    {name:"Prince Edward Island", value:"PE"},
    {name:"Newfoundland and Labrador", value:"NL"}  
  ]
  selectedEvent : Event;
 

  constructor(private eService: EventService) { }
  showDetail(event: Event):void{
    
    this.selectedEvent = event;
    
  }
  ngOnInit() {
    this.getEventsSub = this.eService.getAllEvents().subscribe((data)=>{
      this.events = data;
    },
    ()=>{
      this.loadingError = true;
    });
  }

  ngOnDestroy(){
    if(this.getEventsSub){
      this.getEventsSub.unsubscribe();
    }
    
  }

}
