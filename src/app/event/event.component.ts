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
  constructor(private eService: EventService) { }

  ngOnInit() {
    this.getEventsSub = this.eService.getAllEvents().subscribe((data)=>{
      
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
