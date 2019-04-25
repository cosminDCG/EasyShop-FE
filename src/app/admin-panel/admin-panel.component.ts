import { Component, OnInit, HostListener } from '@angular/core';
import { AdminService } from '../services/admin-service/admin.service';
import { GlobalService } from '../services/global-service/global.service';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  public link: string;
  public user: any={};

  constructor(private adminService:AdminService, private loadingBar: LoadingBarService, private global:GlobalService) { }

  ngOnInit() {
    this.user = this.global.currentUser;
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.user = JSON.parse(aux);
      this.global.currentUser = this.user;
      console.log(this.user);
    }
  }

  @HostListener('window:beforeunload') saveUser() {
    this.global.currentUser = this.user;
    localStorage.setItem('crUser', JSON.stringify(this.user));
  }

  startScrap(event:Event) {
    event.preventDefault();
    this.loadingBar.start();
    this.adminService.scrapLink(this.link).subscribe((res:any)=>{
      this.loadingBar.complete();
    }, (err) =>{
      console.log('Error');
    });
  }

}
