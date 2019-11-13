import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {FileSelectDirective, FileUploader} from 'ng2-file-upload';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import {AuthService} from 'src/data/services/auth.service';
import {ValidationError} from 'src/data/Model/ValidationError';
import { User } from 'src/data/Model/User';
import {UserService} from 'src/data/services/user.service';
import { environment } from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';

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
  sfile : File = null;
  event: EventToCreate;
  validationErrors: ValidationError[];
  warning: string;
  successMessage: boolean;
  private userSubscription: any;
  currentUser: User;
  private token:any;
  
  attachmentList: any;
  constructor(private auth: AuthService, private uService: UserService, private http: HttpClient) { }
  
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
    const file: File = imageInput.files[0];
    this.sfile = file;
    const reader = new FileReader();
   
    reader.addEventListener('load', (event:any) =>{
      debugger;
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }
  onSubmit(f: NgForm): void{
    console.log(this.selectedFile.src);
    console.log(this.selectedFile.file);
    console.log(this.sfile.type);
   this.event.photo = new Blob([this.selectedFile.file], {type: this.sfile.type});
    this.auth.createEvent(this.event).subscribe((success)=>{
      console.log(this.event.photo);
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
