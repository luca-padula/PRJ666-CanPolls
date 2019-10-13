import { Component, OnInit } from '@angular/core';
import{OfficialEvent} from '../../data/Model/OfficialEvent'
import{OfficialEventService} from '../../data/services/official-event.service'


@Component({
  selector: 'app-official-event',
  templateUrl: './official-event.component.html',
  styleUrls: ['./official-event.component.css']
})
export class OfficialEventComponent implements OnInit {

 ofEvent: OfficialEvent[];

selectedEvent : OfficialEvent;
showDetail(event: OfficialEvent):void{
  this.selectedEvent = event;
}
  constructor(private ofEService : OfficialEventService) { }

  getOfEvent():void{
    this.ofEService.getOfficialEvents()
                .subscribe(ofEvent=>{this.ofEvent=ofEvent;console.log(ofEvent);},
                (err) => {
                  console.log(err);
                });
                
  }
  ngOnInit() {
      this.getOfEvent();
  }


}
