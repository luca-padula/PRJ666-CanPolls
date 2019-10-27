import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import {AuthService} from 'src/data/services/auth.service';
import {ValidationError} from 'src/data/Model/ValidationError';
import { User } from 'src/data/Model/User';
import {UserService} from 'src/data/services/user.service';
class ImageSnippet{
  constructor(public src: String, public file: File){}
}
@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  selectedFile: ImageSnippet;
  event: EventToCreate;
  validationErrors: ValidationError[];
  warning: string;
  successMessage: boolean;
  private userSubscription: any;
  currentUser: User;
  private token:any;

  constructor(private auth: AuthService, private uService: UserService) { }
  
  ngOnInit() {
    this.event = new EventToCreate;
    this.token = this.auth.readToken();
    this.userSubscription = this.uService.getUserById(this.token.userId).subscribe((us) =>{
      this.currentUser = us;
      this.event.userId = this.currentUser.userId;
      this.event.isApproved = false;
      console.log(this.currentUser);
      console.log(this.currentUser.firstName);
      console.log(this.event.userId);
    });
  }
  onFileChanged(imageInput: any){
    debugger;
    const file : File = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event:any) =>{
      debugger;
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }
  onSubmit(f: NgForm): void{
    
    this.auth.createEvent(this.event).subscribe((success)=>{
      this.warning = null;
      this.successMessage = true;
      console.log("pass!!");
    }, (err) =>{
      if (err.error.validationErrors) {
        this.validationErrors = err.error.validationErrors;
      }
      else {
        this.warning = err.error.message;
      }
      
    });
    
  }
  ngOnDestroy(){ 
    if(this.userSubscription){this.userSubscription.unsubscribe();}
   }
}
