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
    {name:"British Columbia", value: "BC"},
    {name:"Alberta", value: "AB"}
    
  ]
  selectedEvent : Event;
showDetail(event: Event):void{
  this.selectedEvent = event;
}

  constructor(private eService: EventService) { }

  ngOnInit() {
    this.getEventsSub = this.eService.getAllEvents().subscribe((data)=>{
      this.events = data;
      console.log(this.events);
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
