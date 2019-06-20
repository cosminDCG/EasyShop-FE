import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '../services/global-service/global.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { BlockService } from '../services/block-service/block.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public items: any;
  public categories: any[];
  public folder = "../../assets/dashboard/item";
  public p:Number = 1;

  public showAdminButton = false;
  public showRepButton = false;

  public blockedShop = [];

  constructor(private global: GlobalService,
              private dashboardService: DashboardService,
              private router: Router,
              private blockService: BlockService) { }

  ngOnInit() {

    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser'); 
      this.global.currentUser = JSON.parse(aux);
    }

    this.blockService.getBlockedShops().subscribe((res:any)=>{
      this.blockedShop = res;
    })

    this.dashboardService.allItems().subscribe((res:any)=>{
      this.items = res.filter(item => this.blockedShop.includes(item.shop) === false);
      console.log(this.items);
    }, (err) =>{
      console.log('Error');
    });

    this.dashboardService.allCategories().subscribe((res:any)=>{
      this.categories = res;
    }, (err) =>{
      console.log('Error');
    });

    

    if(this.global.currentUser.role == "admin"){
      this.showAdminButton = true;
    }

    if(this.global.currentUser.role == "rep"){
      this.showRepButton = true;
    }
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
  }

  checkCat(){
    for(let i = 0; i < this.categories.length; i++){
      var aux = this.items.filter(item => item.category === this.categories[i])
      if(aux.length === 0){
        var index = this.categories.indexOf(this.categories[i]);
        this.categories.splice(index,1);
      }
    }
  }

  goToAdminPanel() {
    this.router.navigate(['/user/admin']);
  }

  goToRepPanel() {
    this.router.navigate(['/user/rep']);
  }

  catPhoto(category){
    if (this.items == null)
      return;
    var aux = this.items.filter(item => item.category === category) 
    
    return aux[0].photo.split("item")[1];
  }



}
