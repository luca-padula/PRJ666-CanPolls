import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import { User } from 'src/data/Model/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user: User;
  public warning: string;
  public successMessage: boolean = false;
  public userNotVerified: boolean = false;
  public unverifiedUser: string;
  public rejectionCount: number = 0;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new User;
  }

  onSubmit(f: NgForm): void {
    this.userNotVerified = false;
    this.auth.login(this.user).subscribe((success) => {
      localStorage.setItem('access_token', success.token);
      this.router.navigate(['/home']);
    }, (err) => {
      this.rejectionCount++;
      if (this.rejectionCount >= 5) {
        this.router.navigate(['/forgotPassword']);
      }
      this.warning = err.error.message;
      if (this.warning == 'You need to verify your account before you can log in. Check your email for the link.') {
        this.userNotVerified = true;
        this.unverifiedUser = this.user.userName
      }
    });
  }

  resendVerificationEmail(p_user: User): void {
    this.userNotVerified = false
    p_user.userName = this.unverifiedUser;
    this.auth.resendVerificationEmail(p_user).subscribe((success) => {
      this.successMessage = true;
      setTimeout(() => this.successMessage = false, 4000);
    }, (err) => {
      console.log(err);
    });
  }
}
