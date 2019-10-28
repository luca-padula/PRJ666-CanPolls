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
 
  
    
  private token: any;
  private userSubscription: any;
  currentUser: User;
  private userNameExists: boolean;
  successMessage = false;
  constructor(private auth: AuthService, private uService: UserService){ }
  ngOnInit() {
      this.token = this.auth.readToken();
      this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((us) => {
        this.currentUser = us;
      });
   }
 
  ngOnDestroy(){ 
      if(this.userSubscription){this.userSubscription.unsubscribe();}
  }
  
  checkUniqueUsername(): boolean
  {

    return this.userNameExists;
  }

 
}