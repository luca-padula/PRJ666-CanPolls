import { Component, OnInit } from '@angular/core';
import{OfficialEvent} from '../../data/Model/OfficialEvent'
import{OfficialEventService} from '../../data/services/official-event.service'
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-official-event',
  templateUrl: './official-event.component.html',
  styleUrls: ['./official-event.component.css']
})
export class OfficialEventComponent implements OnInit {

 ofEvent: OfficialEvent[];
 error:HttpErrorResponse;

//get searched event
searchParty:string;

 //get selected event 
selectedEvent : OfficialEvent;
showDetail(event: OfficialEvent):void{
  this.selectedEvent = event;
}


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
