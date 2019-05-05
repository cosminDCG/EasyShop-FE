import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import {PopoverModule} from "ngx-smart-popover";
import {Router} from "@angular/router";
import { Options, ChangeContext } from 'ng5-slider';

import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { GlobalService } from '../services/global-service/global.service';
import { WishlistService } from '../services/wishlist-service/wishlist.service';
import { CartService } from '../services/cart-service/cart.service';
import { ToastrService } from 'ngx-toastr';
import * as $AB from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public showAdminButton = false;
  public items: any;
  public itemAux: any;
  public itemAuxPrice: any;
  public user: any={};
  public p: Number = 1;

  public categories:any;
  
  public categoryFilter = "Category";
  public priceFilter = "Price"
  public desiredPrice ="";
  public rating = 0.0;

  public searchAux: any;

  public firstPhoto: any;
  public src: any;
  private seeProd = 0;

  value: number = 0;
  highValue: number = 15000;
  options: Options = {
    floor: 0,
    ceil: 15000
  };

  constructor(private global:GlobalService, 
              private router: Router, 
              private dashboardService:DashboardService,
              private wishlistService:WishlistService,
              private cartService:CartService,
              private toastrService :ToastrService) { }

  ngOnInit() {
    this.global.redirectUserProfile = null;
    this.user = this.global.currentUser;
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.user = JSON.parse(aux);
      this.global.currentUser = this.user;
      console.log(this.user);
    }
    
    this.dashboardService.allItems().subscribe((res:any)=>{
      this.items = res;
      this.firstPhoto = this.items[0].photo;
      this.src = this.firstPhoto;
      this.itemAux = this.items;
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
  }

  @HostListener('window:beforeunload') saveUser() {
    this.global.currentUser = this.user;
    localStorage.setItem('crUser', JSON.stringify(this.user));
  }

  goToAdminPanel() {
    this.router.navigate(['/user/admin']);
  }

  showPopover(i) {
    var pop = '.pop' + i;
    (<any>$(pop)).popover('toggle');
  }

  selectCategory(category){
    if(category === 'None'){
      this.items = this.itemAux;
      this.itemAux = null;
      this.categoryFilter = 'Category';
      return;
    }
    if(this.itemAux != null){
      this.items = this.itemAux;
    }
    this.categoryFilter = category;
    this.itemAux = this.items;
    this.items = this.items.filter(item => item.category === category);
    this.seeProd = 1;
  }

  addToWishlist(item){
    var wishItem = {
      itemId: item.id,
      userId: this.user.id,
      currentPrice: item.price,
      expectedPrice: this.desiredPrice
    }

    this.wishlistService.insertWishItem(wishItem).subscribe((res:any)=>{
      this.desiredPrice = "";
      this.global.wishItemsNo++;
      this.toastrService.success("", "Added to Wishlist");
    }, (err)=>{
      console.log("error");
    })
  }

  selectPrice(price){
    if(price === "None"){
      this.items.sort((item1, item2) => item1.name > item2.name);
      this.priceFilter = "None";
    }else 
    if(price === "Low to High"){
      this.itemAuxPrice = this.items;
      this.items.sort((item1, item2) => this.global.toCompareFormat(item1.price) - this.global.toCompareFormat(item2.price));
      this.priceFilter = "Low to High";
    } else if(price === "High to Low"){
      this.itemAuxPrice = this.items;
      this.items.sort((item1, item2) => this.global.toCompareFormat(item2.price) - this.global.toCompareFormat(item1.price));
      this.priceFilter = "High to Low";
    } 
  }

  onPriceChange(changeContext: ChangeContext){
    if(this.itemAuxPrice != null)
      this.items = this.itemAuxPrice;
      else this.itemAuxPrice = this.items;
    this.items = this.items.filter(item => this.global.toCompareFormat(item.price) >= changeContext.value && this.global.toCompareFormat(item.price) <= changeContext.highValue);
  }

  addToCart(itemId){
    var toCart = {
      userId: this.user.id,
      itemId: itemId,
      quantity: 1
    }

    console.log(toCart);

    this.cartService.addToCart(toCart).subscribe((res:any)=>{
      if(res == true){
        this.global.cartItemsNo++;
      }
      
      this.toastrService.success("", "Added toCart");
    }, (err)=>{
      console.log("Error");
    });
  }

  searchItems(){
    if(this.searchAux == null){
      this.searchAux = this.items;
    }
    else{
      this.items = this.searchAux;
      this.items = this.items.filter(item => item.name.includes(this.global.searchString));
      console.log(this.global.searchString);
      console.log(this.items);
      return this.items;
    }
  }

  mouseEnter(){
    var index = 1;
      
    this.src = this.items[index].photo;             

      
  }

  mouseLeave(){
    this.src = this.items[0].photo;
  }

  catPhoto(category){
    if (this.items == null)
      return;
    var aux = this.items.filter(item => item.category === category) 
    return aux[0].photo;
  }

}
