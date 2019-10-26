import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {EventToCreate} from 'src/data/Model/EventToCreate';
import {AuthService} from 'src/data/services/auth.service';
import {ValidationError} from 'src/data/Model/ValidationError';
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

  constructor(private auth: AuthService) { }
  
  ngOnInit() {
    this.event = new EventToCreate;
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
}
