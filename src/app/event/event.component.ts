import { Component, OnInit } from '@angular/core';
import {Event} from '../../data/Model/Event';
import { EventWithUserObj } from 'src/data/Model/EventWithUserObj';
import { DatePipe } from '@angular/common';
import {EventService} from '../../data/services/event.service';
import { AuthService } from 'src/data/services/auth.service';
import {HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
  selectedEvent : Event;
  showExpired : boolean = false;
  imageToShow:any;

  constructor(private auth: AuthService, private eService: EventService, private datePipe: DatePipe, private http: HttpClient) { 
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
    this.retrieveImage();
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

  retrieveImage()
  {
    var getExt = this.selectedEvent.photo;
    getExt = getExt.substring(getExt.lastIndexOf('.'));
    var fullImgName = this.selectedEvent.event_id+"Event"+this.selectedEvent.UserUserId+""+getExt;
    console.log("Retrieve : "+fullImgName);
    this.http.get(environment.apiUrl + "/api/getimage/"+fullImgName,{responseType: 'blob'})
    .subscribe( result => {
       this.createImageFromBlob(result);
    });
  }
  
//retrieve uses this function
createImageFromBlob(image: Blob) {
  let reader = new FileReader();
  reader.addEventListener("load", () => {
     this.imageToShow = reader.result;
    // console.log("imagetoshow: "+this.imageToShow);
  }, false);

  if (image) {
     reader.readAsDataURL(image);
  }

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
