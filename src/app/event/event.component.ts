import { Component, OnInit } from '@angular/core';
import {Event} from '../../data/Model/Event';
import { DatePipe } from '@angular/common';
import {EventService} from '../../data/services/event.service';

export class DatePipeComponent {
  today: number = Date.now();
}
@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[];
  getEventsSub: any;
  
curDate:Date;

  loadingError: boolean = false;
  provinces = [
    {name:"British Columbia", value: "BC"},
    {name:"Alberta", value: "AB"}
    
  ]
  selectedEvent : Event;
  showExpired : boolean = false;

  checkValue(event: any){
    if(this.showExpired == false)
    {
      this.getEventsSub = this.eService.getAllEvents(true).subscribe((data)=>{
        this.events = data;
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
      },
      ()=>{
        this.loadingError = true;
      });
      this.showExpired = false;
    }
  }

  constructor(private eService: EventService, private datePipe: DatePipe) { }
  showDetail(event: Event):void{
    
    this.selectedEvent = event;
    
  }

  eventIsExpired(event) {
    return event.date_to < this.datePipe.transform(this.curDate,'yyyy-MM-dd');
  }


  ngOnInit() {
    this.curDate= new Date();
    this.getEventsSub = this.eService.getAllEvents(false).subscribe((data)=>{
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
