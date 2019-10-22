import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var requestURL = 'https://represent.opennorth.ca/boundary-sets/federal-electoral-districts/';

    var request = new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType = 'json';
    request.send();

    request.onload = function () {
      var boundaries = request.response;
      console.log(boundaries.name_plural);
    }
  }

}
