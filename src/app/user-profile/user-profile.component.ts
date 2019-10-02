import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  private paramSubscription: any;
  private userSubscription: any;
  private saveUserSubscription: any;
  currentUser: User;
  
  successMessage =  false;
  failMessage = false;

  ngOnInit() {
  }

}
