import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({

  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      let electionCalendar = document.getElementById("electionCalendar");

      // Remove the hidden caption that the table from the website adds to the table
      let calendarQuery = this.responseXML.querySelector(".table.parbase.section");
      calendarQuery.querySelectorAll(".wb-inv").forEach(e => e.parentNode.removeChild(e));

      // Set the HTML on this website to the query that was retrieved sans caption
      electionCalendar.innerHTML = calendarQuery.innerHTML;
      electionCalendar.innerHTML += "<p>Data retireved from the <a href='https://www.canada.ca/en/public-service-commission/services/political-activities/election-calendar.html'>Government of Canada</a>.</p>"
    }
    xhr.open("GET", 'https://www.canada.ca/en/public-service-commission/services/political-activities/election-calendar.html/');
    xhr.responseType = "document";
    xhr.send();
  }
}
