import { Component, OnInit } from '@angular/core';
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
  constructor() { }

  ngOnInit() {
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
  onSubmit(f){

  }
}
