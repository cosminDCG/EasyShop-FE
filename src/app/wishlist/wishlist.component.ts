/// <reference types="@types/googlemaps" />

import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService } from '../services/wishlist-service/wishlist.service';
import { GlobalService } from '../services/global-service/global.service';
import { NumberValueAccessor } from '@angular/forms/src/directives';
import { MapsAPILoader } from '@agm/core';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart-service/cart.service';


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  public items: any;
  public user: any={};
  private autocomplete: any;
  public placeService: any;
  public zoom = 17;

  public label = {
    text: "You",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px"
  };
  public shopIcon = {
    labelOrigin: { x: 16, y: 48 },
    url : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
  };
  public icon = {
    labelOrigin: { x: 16, y: 48 },
    url : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  }
  public currentPosition: any={};
  public showClosest = 0;

  lat: any;
  lng: any;
  
  public shops : any[] =[];
  public auxShops: any[] = [];
  public distance = 0;

  constructor(private wishlistService:WishlistService,
              private global:GlobalService,
              private router:Router,
              private cartService:CartService,
              private mapsAPILoader: MapsAPILoader,
              private ngZone: NgZone) { 
                this.mapsAPILoader.load().then(() => {
                  this.autocomplete = new 
                  google.maps.places.AutocompleteService();
                });
              }

  ngOnInit() {

    if (navigator)
    {
    navigator.geolocation.getCurrentPosition( pos => {
        this.lng = +pos.coords.longitude;
        this.lat = +pos.coords.latitude;
        this.currentPosition.lat = this.lat;
        this.currentPosition.lng = this.lng;
      });
    }

    this.user = this.global.currentUser;
    console.log(this.global.toCompareFormat("123123123"));
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.user = JSON.parse(aux);
      this.global.currentUser = this.user;
      console.log(this.user);
    }
    this.wishlistService.getWishItemsForUser(this.user.id).subscribe((res:any)=>{
      this.items = res;
    },(err)=>{

    });
  }

  @HostListener('window:beforeunload') saveUser() {
    this.global.currentUser = this.user;
    localStorage.setItem('crUser', JSON.stringify(this.user));
  }

  addToCart(item){
    var toCart = {
          userId : this.global.currentUser.id,
          itemId : item.id,
          quantity: 1
        }
    
    this.cartService.addToCart(toCart).subscribe((res:any)=>{
      if(res == true){
        this.global.cartItemsNo ++;
      }
      
    }, (err)=>{

    });
  }


  deleteWishItem(wishId){
    this.wishlistService.deleteWishItem(wishId).subscribe((res:any)=>{
      this.items = this.items.filter(item => item.wishId !== wishId);
      this.global.wishItemsNo--;
    },(err)=>{
      console.log("error");
    });
  }

  mapReady($event: any){
    this.placeService = new google.maps.places.PlacesService($event);
  }

  getShopCoordonates(shop) {
    var term = shop + " " + this.global.currentUser.city;
    this.autocomplete.getPlacePredictions({ input: term }, data => {
      
      if (data) {
        var sh :any[] = [];
        for(let i = 0; i < data.length; i++){
          this.placeService.getDetails({
            placeId: data[i].place_id
            }, function (result, status) {
              var shopToAdd = {
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
                label: {
                  text: shop,
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "16px"
                }
              }
             sh.push(shopToAdd);
            });
         
        }
        this.shops = sh;
        this.zoom = 12;
      }

    });
  }

  selectClosestShop(){
    var copyShops = this.shops;
    this.auxShops = this.shops;
    this.showClosest = 1;
    copyShops.sort((shop1, shop2)=> this.global.distance(this.currentPosition, shop1) - this.global.distance(this.currentPosition, shop2));
    this.shops = [];
    this.shops[0] = copyShops[0];
  }

  selectAllShops(){
    this.showClosest = 0;
    this.shops = this.auxShops;
  }

  distanceToShop(shop){
    this.distance = this.global.distance(this.currentPosition, shop)/1000;
  }

 

}
