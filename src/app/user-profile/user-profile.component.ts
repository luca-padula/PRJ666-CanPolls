import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../data/services/userService'
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 
  constructor(){ }
  /*
   private auth: AuthService, private route: ActivatedRoute, private uService: UserService
  private paramSubscription: any;
  private userSubscription: any;
  private saveUserSubscription: any;
  currentUser: User;
  
  successMessage =  false;
  failMessage = false;
  private token: any;*/

  ngOnInit() {
 /*   console.log("isnide on int");
      this.token = this.auth.readToken();
      console.log(this.token.userId);
      this.userSubscription = this.uService.getUserById(this.token.userId).subscribe(us => this.currentUser = us);
  */}
 
  ngOnDestroy(){
    //if(this.paramSubscription){this.paramSubscription.unsubscribe();}
   // if(this.userSubscription){this.userSubscription.unsubscribe();}
  }
 
}
