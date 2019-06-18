import { Component, OnInit, HostListener } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import { AdminService } from '../services/admin-service/admin.service';
import { UserService } from '../services/user-service/user.service';
import { GlobalService } from '../services/global-service/global.service';
import { BanService } from '../services/ban-service/ban.service';
import { PromoService } from '../services/promo-service/promo.service';

import { LoadingBarService } from '@ngx-loading-bar/core';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { CartService } from '../services/cart-service/cart.service';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';
import { BillService } from '../services/bill-service/bill.service';
import { ChartService } from '../services/chart-service/chart.service';

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

  public chooseUser = 'User';
  public repUser: any;
  public allUsers: any[];

  public allShops: any[];
  public allOrders: any[];

  public scrapUserCheck = 0;

  public currentOrder = {
    items: []
  };

  public chartData : any[];

  public chartLabels : any[];

  public allBills: any[];

  public chartTitle = '';
  public chartType = '';
  public ordersNo = 0;
  public soldItemsNo = 0;

  constructor(private adminService: AdminService, 
              private loadingBar: LoadingBarService, 
              private global: GlobalService,
              private userService: UserService,
              private banService: BanService,
              private promoService: PromoService,
              private dashService: DashboardService,
              private cartService: CartService,
              private billService: BillService,
              private chartService: ChartService) { }

  ngOnInit() {
    this.user = this.global.currentUser;

    this.userService.getAllUsers().subscribe((res:any)=>{
      this.users = res;
    });

    this.dashService.allShops().subscribe((res:any)=>{
      this.allShops = res;
    });

    this.cartService.allOrders().subscribe((res:any)=>{
      this.allOrders = res;
    });

    this.billService.allBills().subscribe((res:any)=>{
      this.allBills = res;
    }, (err)=>{

    });

    this.shopOrdersPerWeekInit(); 

    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.user = JSON.parse(aux);
      this.global.currentUser = this.user;
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

    if(this.scrapUserCheck === 0){
      var shop = '';
      if(this.link.includes("emag"))
        shop = "emag";
        else if(this.link.includes("carrefour"))
                shop = "Carrefour";

      this.userService.updateUserToRep(this.repUser.id, "rep", shop).subscribe((res:any)=>{

      }, (err)=>{

      });
    }
  }

  selectRole(role, index){
      var shop = '';
      this.userService.getShopByRepId(this.users[index].id).subscribe((res:any)=>{
        console.log(res);
        shop = res;
      }, (err) => {

      });

      this.userService.deleteRep(shop).subscribe((res:any)=>{

      }, (err)=>{

      });

    this.users[index].role = role;
    this.userService.updateUserRole(this.users[index].id, role).subscribe((res:any)=>{

    }, (err)=>{

    });
  }

  selectShopRep(index, role, shop){
    var ok = 0;
    this.userService.getShopRep(shop).subscribe((res:any)=>{
      ok = res;
    }, (err)=>{

    });

    if(ok !== 0){

    }else{
      this.users[index].role = role;
      this.userService.updateUserToRep(this.users[index].id, role, shop).subscribe((res:any)=>{

      }, (err)=>{});
    }
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

  chartTab(){
    this.toScrap = 0;
    this.toUsers = 0;
    this.toChart = 1;
    this.toOrders = 0;
  }

  ordersTab(){
    this.toScrap = 0;
    this.toUsers = 0;
    this.toChart = 0;
    this.toOrders = 1;
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

  selectUser(user){
    this.repUser = user;
    this.chooseUser = user.firstName + " " + user.lastName;
  }

  checkForRep(){
    var shop ='';
    if(this.link.includes("emag"))
      shop = "emag";
      else if(this.link.includes("carrefour")) shop = "Carrefour";
    
    this.userService.getShopRep(shop).subscribe((res:any)=>{
      if(res !== 0)
        this.scrapUserCheck = 1;
      else this.scrapUserCheck = 0;
    })

  }

  orderNumber(id){
    if(id < 10)
      return "0000" + id;
    if(id >= 10 && id < 100)
      return "000" + id;
    if(id >= 100 && id < 1000)
      return "00" + id;
    if(id >= 1000 && id <10000)
      return "0" + id;
    if(id >= 10000)
      return id;
  }

  showOrderDetails(order){
    this.currentOrder = order;
    console.log(this.currentOrder);
  }

  shopOrdersPerWeekInit(){
    this.chartTitle = "Easy Shop statistics from last week";
    this.chartType = 'bar';
    var shops = []
    this.chartService.getEasyOrdersPerWeek().subscribe((res:any)=>{
      this.chartData = [];
      this.chartLabels = [];
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(res[i].date);
        this.soldItemsNo += res[i].quantity;
        shops.push(res[i].shop);
        this.ordersNo += res[i].stats;
      }
      this.chartLabels = this.chartLabels.filter((item, index) => this.chartLabels.indexOf(item) === index);
      shops = shops.filter((item, index) => shops.indexOf(item) === index);

      for(let i = 0; i < shops.length; i++){
        var aux = {
          data: new Array(this.chartLabels.length).fill(0),
          label: shops[i]
        }
        for(let j = 0; j < res.length; j++){
          if(res[j].shop === shops[i]){
            aux.data[this.chartLabels.indexOf(res[j].date)] = res[j].stats;
          }
        }
        this.chartData.push(aux);
      }
    })
  }

  shopOrdersPerMonthInit(){
    this.chartTitle = "Easy Shop statistics from last month";
    this.chartType = 'horizontalBar';
    var shops = [];
    this.chartService.getEasyOrdersPerMonth().subscribe((res:any)=>{
      this.chartData = [];
      this.chartLabels = [];
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(res[i].date);
        this.soldItemsNo += res[i].quantity;
        shops.push(res[i].shop);
        this.ordersNo += res[i].stats;
      }
      this.chartLabels = this.chartLabels.filter((item, index) => this.chartLabels.indexOf(item) === index);
      shops = shops.filter((item, index) => shops.indexOf(item) === index);

      for(let i = 0; i < shops.length; i++){
        var aux = {
          data: new Array(this.chartLabels.length).fill(0),
          label: shops[i]
        }
        for(let j = 0; j < res.length; j++){
          if(res[j].shop === shops[i]){
            aux.data[this.chartLabels.indexOf(res[j].date)] = res[j].stats;
          }
        }
        this.chartData.push(aux);
      }
    })
  }

  shopOrdersPerYearInit(){
    this.chartTitle = "Easy Shop statistics from last year";
    this.chartType = 'line';
    var shops = [];
    this.chartService.getEasyOrdersPerYear().subscribe((res:any)=>{
      this.chartData = [];
      this.chartLabels = [];
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(this.global.getMonthName(res[i].date));
        this.soldItemsNo += res[i].quantity;
        shops.push(res[i].shop);
        this.ordersNo += res[i].stats;
      }
      this.chartLabels = this.chartLabels.filter((item, index) => this.chartLabels.indexOf(item) === index);
      shops = shops.filter((item, index) => shops.indexOf(item) === index);

      for(let i = 0; i < shops.length; i++){
        var aux = {
          data: new Array(this.chartLabels.length).fill(0),
          label: shops[i]
        }
        for(let j = 0; j < res.length; j++){
          if(res[j].shop === shops[i]){
            aux.data[this.chartLabels.indexOf(this.global.getMonthName(res[j].date))] = res[j].stats;
          }
        }
        this.chartData.push(aux);
      }
    })
  }
}
