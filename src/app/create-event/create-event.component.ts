import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

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
  submitted = false;
  eventForm: FormGroup;
  registered = false;
  constructor(private formBuilder: FormBuilder) { }
  invalidEventTitle(){
    return (this.submitted && this.eventForm.controls.event_title.errors != null);
  }

  invalidVenueName(){
    return (this.submitted && this.eventForm.controls.venue_name.errors != null);
  }

  invalidStreetName(){
    return (this.submitted && this.eventForm.controls.street_name.errors != null);
  }

  invalidCity(){
    return (this.submitted && this.eventForm.controls.city.errors != null);
  }

  invalidProvince(){
    return (this.submitted && this.eventForm.controls.province.errors != null);
  }
  invalidPostalCode(){
    return (this.submitted && this.eventForm.controls.postal_code.errors != null);
  }
  invalidDateTime(){
    return (this.submitted && (this.eventForm.controls.date_from.errors != null || this.eventForm.controls.time_from.errors != null || this.eventForm.controls.date_to.errors != null || this.eventForm.controls.time_to.errors != null));
  }
  invalidEventDescription(){
    return (this.submitted && this.eventForm.controls.event_description.errors != null);
  }
  invalidAttendeeLimit(){
    return (this.submitted && this.eventForm.controls.attendee_limit.errors != null);
  }
  ngOnInit() {
    this.eventForm = this.formBuilder.group({
      event_title: ['', Validators.required],
      venue_name: ['', Validators.required],
      street_name: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', Validators.required],
      postal_code: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
      date_from: ['', Validators.required],
      date_to: ['', Validators.required],
      time_from: ['', Validators.required],
      time_to: ['', Validators.required],
      event_description: ['', Validators.required],
      attendee_limit: ['', Validators.required]
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
  onSubmit(){
    this.submitted = true;
    if(this.eventForm.invalid == true){
      return;
    }
    else{
      this.registered = true;
    }
  }
}
