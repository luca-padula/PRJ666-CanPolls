import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { EventWithUserObj } from 'src/data/Model/EventWithUserObj';
import { AdminService } from '../../data/services/admin.service'
import { UserService } from '../../data/services/user.service'
import { EventService } from 'src/data/services/event.service';
import { AuthService } from 'src/data/services/auth.service';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  private token: any;
  users: User[];
  filteredUsers: User[];

  events: EventWithUserObj[];
  filteredEvents: EventWithUserObj[];

  partyUsers: User[];
  filteredPartyUsers: User[];
  
  getUserSub: any;
  loadingError:boolean = false;

  selectedUserParty: string = "";
  private adminSub: any;
  private eventSub: any;

  clickedUserID: number = 0;

  currentUserId:number=0;
  constructor(private auth: AuthService, private aService: AdminService, private eService: EventService, private router: Router) { }

  private isuserAdmin: boolean = false;
  private errorMessages: String = "";
  
  private isSuccessful: boolean = false;
  private isUnSuccessful: boolean = false;


  ngOnInit() {
    this.token = this.auth.readToken();

    if(this.token!= null && this.token.isAdmin == true)
    {
      this.isuserAdmin = true;
       this.adminSub = this.aService.getAllUsers().subscribe(data => {
        this.users = data;
        this.filteredUsers=data;
      }
      )
      this.adminSub = this.aService.getAllUsersByParty(this.token.partyAffiliation).subscribe(data => {
        this.partyUsers = data;
        this.filteredPartyUsers = data;
      }
      )
      this.eventSub = this.eService.getAllEventsWithUser().subscribe(data => {
        this.events = data;
        this.filteredEvents=data;
        console.log(this.filteredEvents);
      }
      )

    }
    else if(this.token!=null)
    {
      this.currentUserId = this.token.userId
      this.router.navigate(['/userProfile']);
    }
    else
    {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(){ 
    if(this.adminSub){this.adminSub.unsubscribe();}
    if(this.eventSub){this.eventSub.unsubscribe();}
  } 

  onUserSearch(event:any)
  {
      let substring : string = event.target.value.toLowerCase();
      this.filteredUsers = this.users.filter((e) => ((e.userName.toLowerCase().indexOf(substring) !== -1 )
       || (e.email.toLowerCase().indexOf(substring) !== -1) ))
  }

  onAffUserSearch(event:any)
  {
      let substring : string = event.target.value.toLowerCase();
      console.log(this.partyUsers);
      this.filteredPartyUsers = this.partyUsers.filter((e)  => (
          (e.userName.toLowerCase().indexOf(substring) !== -1 )
       || (e.email.toLowerCase().indexOf(substring) !== -1) 
       || (e.userId.toString().toLowerCase().indexOf(substring) !== -1)
       || ( (e.affiliationApproved == true ? "Approve" : "Decline").toString().toLowerCase().indexOf(substring) !== -1) 
       ))
  }

  onEventSearch(event:any)
  {
      let substring : string = event.target.value.toLowerCase();
      this.filteredEvents = this.events.filter((e) => {
        return (e.event_title.toLowerCase().indexOf(substring) !== -1 )
      || (e.User.partyAffiliation.toLowerCase().indexOf(substring) !== -1) })
       //
  }

  routeEvent(eventId: number): void {
    this.router.navigate(['/event', eventId]);
  }

  onUserStatusChange(us: any)
  {
      this.aService.updUserAccStatus(us).subscribe();
      this.clickedUserID = us.userId;
      console.log(this.clickedUserID)
  }

  onAffiliationChange(us: any)
  {
      this.aService.updUserAffStatus(us).subscribe();
      this.clickedUserID = us.userId;
      console.log(this.clickedUserID)
  }

  onEventStatusChange(eve: any, event: any)
  {
       let adminParty = this.token.partyAffiliation; 
       let eventStatusString : string = event.target.value.toString();
 
      if(adminParty == eve.User.partyAffiliation)
      {
        eve.status = eventStatusString;
        this.aService.approveEvent(eve.event_id,eve).subscribe();
        this.isSuccessful = true;

        if(eve.status.toString() == "A")
          eventStatusString = "Approved";
        else   if(eve.status.toString() == "D")
        eventStatusString = "Declined";
        else   if(eve.status.toString() == "C")
        eventStatusString = "Cancelled";
        else 
        eventStatusString = "In Progress";
        this.errorMessages = "Event "+eventStatusString+"." + ((eve.status.toString() == "P") ? "": " An email has been sent to the user.");
       
        setTimeout(()=>{
          this.isSuccessful = false;
        },5000);
      }
      else
      {
        this.isUnSuccessful = true;
        this.errorMessages = "You cannot alter other parties events!!";
        setTimeout(()=>{
          this.isUnSuccessful = false;
        },5000);
      }
  }

  fillEvents(us: any)
  {
    this.clickedUserID = us.userId;
    this.selectedUserParty = us.partyAffiliation;
    console.log(this.clickedUserID)
    console.log(this.selectedUserParty)
    if(this.clickedUserID!=0)
    {
      this.eService.getAllEventsByUser(this.clickedUserID).subscribe(data => {
        console.log(data);
        this.events = data;
        this.filteredEvents=data;
      }
      )
    }
  }

}
