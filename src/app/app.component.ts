import { Component } from '@angular/core';
import { ViewChild } from '@angular/core';

import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'prj666-canpolls';
  faHome = faHome;
  faEnvelope = faEnvelope;

  ngOnInit() {
    
  }
}