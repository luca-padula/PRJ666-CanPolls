import { Component, OnInit } from '@angular/core';
import {Event} from '../../data/Model/Event';
import { EventWithUserObj } from 'src/data/Model/EventWithUserObj';
import { DatePipe } from '@angular/common';
import {EventService} from '../../data/services/event.service';
import { AuthService } from 'src/data/services/auth.service';

export class DatePipeComponent {
  today: number = Date.now();
}
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  events: EventWithUserObj[];
  filteredEvents: EventWithUserObj[];
  getEventsSub: any;
  canCreateEvent: boolean=false;
  curDate:Date;
  token:any;
  loadingError: boolean = false;
<<<<<<< HEAD
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
=======
>>>>>>> b2a8d896a67ad0721b2e7bb7d8ee3273f9b65703
  selectedEvent : Event;
  showExpired : boolean = false;

  constructor(private auth: AuthService, private eService: EventService, private datePipe: DatePipe) { 
    this.token = this.auth.readToken();
    
    if(this.token!= null && this.token.partyAffiliation!="Unaffiliated" && this.token.affiliationApproved !=false)
    {
      this.canCreateEvent =true;

    }
    else
    {
      this.canCreateEvent =false;
    }
  }
  ngOnInit() {
    this.curDate= new Date();
    this.getEventsSub = this.eService.getAllEvents(false).subscribe((data)=>{
      //console.log(JSON.stringify(data));
      this.events = data;
      this.filteredEvents = data;
    },
    ()=>{
      this.loadingError = true;
    });
  }
  
  
  showDetail(event: Event):void{
    
    this.selectedEvent = event;
    
  }

  eventIsExpired(event) {
    return event.date_from < this.datePipe.transform(this.curDate,'yyyy-MM-dd');
  }

  onEventSearch(event:any)
  {
      let substring : string = event.target.value.toLowerCase();
      this.filteredEvents = this.events.filter((e) => {
        return (e.event_title.toLowerCase().indexOf(substring) !== -1 )
      || (e.User.partyAffiliation.toLowerCase().indexOf(substring) !== -1)
        || (e.Location.venue_name.toLowerCase().indexOf(substring) !== -1) 
        || (e.Location.city.toLowerCase().indexOf(substring) !== -1) 
        || (e.Location.province.toLowerCase().indexOf(substring) !== -1) 
        || (e.Location.postal_code.toLowerCase().indexOf(substring) !== -1) })
  }



  checkValue(event: any)
  {
    if(this.showExpired == false)
    {
      this.getEventsSub = this.eService.getAllEvents(true).subscribe((data)=>{
        this.events = data;
        this.filteredEvents = data;
      },
      ()=>{
        this.loadingError = true;
      });
      this.showExpired = true;
    }
    else
    {
      this.getEventsSub = this.eService.getAllEvents(false).subscribe((data)=>{
        this.events = data;
        this.filteredEvents = data;
      },
      ()=>{
        this.loadingError = true;
      });
      this.showExpired = false;
    }
  }



  ngOnDestroy(){
    if(this.getEventsSub){
      this.getEventsSub.unsubscribe();
    }
    
  }

}
