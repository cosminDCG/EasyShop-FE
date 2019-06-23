import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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
              private wishService:WishlistService,
              private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.url =  this.router.url;
    this.user = this.global.currentUser;

    if(this.url.includes("/dashboard") || this.url.includes('/cart')){
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

  async searchItem(){
    
    this.ngxService.start();
    await new Promise((resolve)=>{setTimeout(() => {
      this.ngxService.stop();
      if(this.searchCriteria === '' || this.searchCriteria == null || !this.searchCriteria.replace(/\s/g, '').length){
        this.global.items = this.global.stringFilterAux;
        return;
      }
      this.global.items = this.global.stringFilterAux;
      this.global.items = this.global.items.filter(item => item.name.toLowerCase().includes(this.searchCriteria.toLowerCase()) );  
    }, 500);});
    
    console.log("am ajuns");
  }

  refreshProfile(){
    window.location.reload();
  }
}
