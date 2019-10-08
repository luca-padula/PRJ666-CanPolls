import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../data/services/userService'
 

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 
  constructor( private route: ActivatedRoute, private uService: UserService){ }
  private paramSubscription: any;
  private userSubscription: any;
  private saveUserSubscription: any;
  currentUser: User;
  
  successMessage =  false;
  failMessage = false;

  ngOnInit() {
     this.paramSubscription = this.route.params.subscribe((params) => {
      this.userSubscription = this.uService.getUserById(params['userId']).subscribe((us) => {
        this.currentUser = us[0];

      });
 }); 
  }
 
  ngOnDestroy(){
    if(this.paramSubscription){this.paramSubscription.unsubscribe();}
    if(this.userSubscription){this.userSubscription.unsubscribe();}
  }
 
}
