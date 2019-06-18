import { Component, OnInit, HostListener, NgZone, ViewChild, ElementRef } from '@angular/core';

import { ItemService } from '../services/item-service/item.service';
import { GlobalService } from '../services/global-service/global.service';
import { CartService } from '../services/cart-service/cart.service';

import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-cheapest-prod',
  templateUrl: './cheapest-prod.component.html',
  styleUrls: ['./cheapest-prod.component.css']
})
export class CheapestProdComponent implements OnInit {

  public searchItem: any;
  public targetItems: any = [];
  public notFound: any[] = [];

  public choices: any;

  public wayToShop: any[];
  public shopNames: any[];
  public closestShops: any[];

  private autocomplete: any;
  public placeService: any;
  public shops : any[] =[];
  public auxShops: any[] = [];
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

  constructor(private itemService: ItemService,
              private global: GlobalService,
              private cartService: CartService,
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

    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.global.currentUser = JSON.parse(aux);
    }
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
  }

  addItem(){
    this.targetItems.push(this.searchItem);
    this.searchItem = '';
  }

  getCheapestChoices(){
    this.itemService.getCheapestChoices(this.targetItems).subscribe((res:any)=>{
      this.choices = res;
      
      this.notFound = [];
      this.shopNames = [];
      for(let i = 0; i < this.choices.length; i++){
        this.shopNames.push(this.choices[i].shop)
        if(this.choices[i].id == 0){
          this.notFound.push(this.targetItems[i]);
        }
      }
      for(let i = 0; i < this.choices.length; i++){
        if(this.choices[i].id == 0){
          this.choices.splice(i, 1);
          i --;
        }
      }
      
    }, (err)=>{

    });

  }

  removeItem(index){
    this.targetItems.splice(index,1);
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

  addAllToCart(){
    this.choices.map(item => item.quantity = 1);
    this.cartService.addMultipleToCart(this.choices, this.global.currentUser.id).subscribe((res:any)=>{
      this.global.cartItemsNo += res;
    }, (err)=>{

    });
  }

  mapReady($event: any){
    this.placeService = new google.maps.places.PlacesService($event);
  }

  getShopCoordonates(shop) {
    this.shops = [];
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

  totalSum(){
    var total = 0;
    for(let i=0; i < this.choices.length; i++)
      total += this.global.toCompareFormat(this.choices[i].price);
    return total;
  }

  getClosestShops(){
    this.closestShops = [];
    this.shopNames = [];
    var aux = [];

    for(let i = 0; i < this.choices.length; i++){
      this.shopNames[i]=this.choices[i].shop;
    }

    for(let i = 0; i < this.shopNames.length; i++){
      var term = this.shopNames[i] + " " + this.global.currentUser.city;
      this.autocomplete.getPlacePredictions({ input: term }, data => {
      
        if (data) {
          var sh :any[] = [];
          var that = this;
          for(let j = 0; j < data.length; j++){
            this.placeService.getDetails({
              placeId: data[j].place_id
              }, function (result, status) {
                var shopToAdd = {
                  lat: result.geometry.location.lat(),
                  lng: result.geometry.location.lng(),
                  label: {
                    text: that.shopNames[i],
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "16px"
                  }
                }
               sh.push(shopToAdd);
               if(j == data.length - 1){
                sh.sort((shop1, shop2)=> that.global.distance(that.currentPosition, shop1) - that.global.distance(that.currentPosition, shop2));
                console.log("sh este:", sh);
                that.closestShops.push(sh[0]);
                console.log("magazinul este:", sh[0]);
                that.wayToShop = that.closestShops.sort((shop1, shop2)=> that.global.distance(that.currentPosition, shop1) - that.global.distance(that.currentPosition, shop2));
               }
              });
              
          }
          this.zoom = 12;
        }
        
      });
      
    }
  }

  setShop(){
    this.shops = this.wayToShop;
  }

  removeResult(index){
    this.choices.splice(index,1);
  }

}
