import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart } from '@angular/router';
import { AuthService } from 'src/data/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public token: any;
  private UserIsAdmin: boolean = false;


  constructor(
    private auth: AuthService,
    private router: Router
    ) { }

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart)
      {
        this.token = this.auth.readToken();
        //console.log("Userid: "+JSON.stringify(this.token));
        if(this.token!= null && this.token.isAdmin == true)
        {
          //console.log("Admin: "+this.token.isAdmin);  
          this.UserIsAdmin=true;
        }
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.token = null;
    this.router.navigate(['/login']);
  }

}
/**
 *       


      
 */