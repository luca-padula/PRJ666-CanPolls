import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { UserService } from '../../data/services/user.service'
import { AuthService } from 'src/data/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
 
  constructor(private auth: AuthService, private uService: UserService){ }
    
  private userSubscription: any;
  private saveUserSubscription: any;
  currentUser: User;
  
  successMessage =  false;
  failMessage = false;
  private token: any;

  ngOnInit() {
      this.token = this.auth.readToken();
      this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((us) => {
        this.currentUser = us;
        console.log(this.currentUser);
        console.log(this.currentUser.firstName);
      });
   }
 
  ngOnDestroy(){ 
   if(this.userSubscription){this.userSubscription.unsubscribe();}
  }
 
}