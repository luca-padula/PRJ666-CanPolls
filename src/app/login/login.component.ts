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
  public rejectionCount: number = 0;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new User;
  }

  onSubmit(f: NgForm): void {
    this.auth.login(this.user).subscribe((success) => {
      localStorage.setItem('access_token', success.token);
      this.router.navigate(['/home']);
    }, (err) => {
      this.rejectionCount++;
      if (this.rejectionCount >= 5) {
        this.router.navigate(['/home']);
      }
      this.warning = err.error.message;
    });
  }
}
