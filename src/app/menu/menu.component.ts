import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { GlobalService } from '../services/global-service/global.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { CartService } from '../services/cart-service/cart.service';
import { WishlistService } from '../services/wishlist-service/wishlist.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public url: string;
  public activateSearch = false;
  public user: any;
  public searchCriteria: string;

  constructor(private router: Router, 
              private global:GlobalService, 
              private authService:AuthenticationService,
              private cartService:CartService,
              private wishService:WishlistService) { }

  ngOnInit() {
    this.url =  this.router.url;
    this.user = this.global.currentUser;
    if(this.url === '/dashboard' || this.url.includes('/cart')){
      this.activateSearch = true;
    }
    this.cartService.getCartItems(this.user.id).subscribe((res:any)=>{
      this.global.cartItemsNo = res.length;
    }, (err)=>{

    });
    this.wishService.getWishItemsForUser(this.user.id).subscribe((res:any)=>{
      this.global.wishItemsNo = res.length;
    }, (err)=>{

    });
  }

  logout() {
    localStorage.removeItem("crUser");
    this.global.currentUser = null;
    this.authService.logout().subscribe((res:any)=>{
      this.router.navigate(['/authentication']);
    }, (err) =>{
      console.log('Error');
    })
  }

  searchItem(){
    this.global.searchString = this.searchCriteria;
  }

}
