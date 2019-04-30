import { Component, OnInit, HostListener } from '@angular/core';

import { AdminService } from '../services/admin-service/admin.service';
import { UserService } from '../services/user-service/user.service';
import { GlobalService } from '../services/global-service/global.service';
import { BanService } from '../services/ban-service/ban.service';
import { PromoService } from '../services/promo-service/promo.service';

import { LoadingBarService } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  public link: string;
  public user: any={};
  public users: any;

  public toScrap = 1;
  public toUsers = 0;
  public toChart = 0;
  public toOrders = 0;

  public banDays = '';
  public banReason = '';

  public promoPercent = '';

  constructor(private adminService: AdminService, 
              private loadingBar: LoadingBarService, 
              private global: GlobalService,
              private userService: UserService,
              private banService: BanService,
              private promoService: PromoService) { }

  ngOnInit() {
    this.user = this.global.currentUser;
    this.userService.getAllUsers().subscribe((res:any)=>{
      this.users = res;
      console.log(this.users); 
    })
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

  capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  selectRole(role, index){
    this.users[index].role = role;
  }

  scrapTab(){
    this.toScrap = 1;
    this.toUsers = 0;
    this.toChart = 0;
    this.toOrders = 0;
  }

  usersTab(){
    this.toScrap = 0;
    this.toUsers = 1;
    this.toChart = 0;
    this.toOrders = 0;
  }

  addBan(bannedUserId){
    var ban = {
      bannedBy: this.global.currentUser.id,
      bannedUser: bannedUserId,
      banDays: this.banDays,
      reason: this.banReason
    }

    this.banService.addBan(ban).subscribe((res:any)=>{
      this.banDays = '';
      this.banReason = '';
    }, (err)=>{

    });
  }

  addPromo(id){
    var promo = {
      userId : id,
      promoPercent: this.promoPercent
    };

    this.promoService.setCustomPromo(promo).subscribe((res:any)=>{
      this.promoPercent = '';
    }, (err)=>{

    });
  }

}
