import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';
import { ValidationError } from 'src/data/Model/ValidationError';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  id: string;
  token: string;
  password: string;
  password2: string;
  successMessage: boolean;
  errorMessage: boolean;
  validationErrors: ValidationError[];

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params) => {
        this.id = params['id'];
        this.token = params['token'];
      }, (err) => {
        console.log('Unable to get route parameters', err);
      });
  }

  // This function resets the user's password with the data entered in the password reset form
  onSubmit(f: NgForm): void {
    this.errorMessage = false;
    this.validationErrors = [];
    this.auth.resetPassword(this.id, this.token, this.password, this.password2)
      .subscribe((success) => {
        this.successMessage = true;
      }, (err) => {
        if (err.error.validationErrors) {
          this.validationErrors = err.error.validationErrors;
        }
        else {
          this.errorMessage = true;
        }
      });
  }

}
