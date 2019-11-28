import { Component, OnInit,Input, OnChanges } from '@angular/core';
import{OfficialEvent} from '../../data/Model/OfficialEvent'
import{OfficialEventService} from '../../data/services/official-event.service'
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-official-event',
  templateUrl: './official-event.component.html',
  styleUrls: ['./official-event.component.css']
})
export class OfficialEventComponent implements OnInit{

 ofEvent: OfficialEvent[];
 error:HttpErrorResponse;

//get searched event
searchParty:string;

 //get selected event 
selectedEvent : OfficialEvent;
showDetail(event: OfficialEvent):void{
  this.selectedEvent = event;
}

//get drop down menu
provinces = [
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

party = [
  {name:"Liberal", value: "Liberal"},
  {name:"Conservative", value: "Conservative"},
  {name:"NDP", value:"NDP"},
  {name:"Coalition Avenir Québec", value:"CAQ"},
  {name:"Saskatchewan Party", value:"Saskatchewan Party"}

  
]


//get all events 
  constructor(private ofEService : OfficialEventService) { }

  getOfEvent():void{
    this.ofEService.getOfficialEvents()
                .subscribe(ofEvent=>{this.ofEvent=ofEvent;},
                (err) => {this.error = err});
                
  }
 
  ngOnInit() {
      this.getOfEvent();
  }


}
