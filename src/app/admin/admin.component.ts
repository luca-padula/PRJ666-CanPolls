import { Component, OnInit } from '@angular/core';
import { User } from 'src/data/Model/User';
import { AdminService } from '../../data/services/admin.service'
import { UserService } from '../../data/services/user.service'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[];
  filteredUsers: User[];

  getUserSub: any;
  loadingError:boolean = false;

  private adminSub: any;
  private uSub: any;

  constructor(private uService: UserService, private aService: AdminService) { }

  ngOnInit() {
      this.adminSub = this.aService.getAllUsers().subscribe(data => {
        this.users = data;
        this.filteredUsers=data;
      }
      )
  }

  onUserSearch(event:any)
  {
      let substring : string = event.target.value.toLowerCase();
      this.filteredUsers = this.users.filter((e) => ((e.userName.toLowerCase().indexOf(substring) !== -1 )
       || (e.email.toLowerCase().indexOf(substring) !== -1) ))
  }

  onStatusChange(us: any)
  {
     // let selectedOpt = event.target.value;
      this.aService.updUserAccStatus(us).subscribe();
    //  this.aService.updUserAccStatus(selectedOpt)
  }
}
