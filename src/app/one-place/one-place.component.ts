import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { GlobalService } from '../services/global-service/global.service';
import { ItemService } from '../services/item-service/item.service';
import { CartService } from '../services/cart-service/cart.service';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'app-one-place',
  templateUrl: './one-place.component.html',
  styleUrls: ['./one-place.component.css']
})
export class OnePlaceComponent implements OnInit {

  public searchItem: any;
  public targetItems: any = [];
  public resultItems: any;
  public notFound: any[] =[];

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

  constructor(private global: GlobalService,
              private itemService: ItemService,
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
    if(this.searchItem == '' || this.searchItem == null)
      return;

    if(!this.searchItem.replace(/\s/g, '').length){
      this.searchItem = '';
      return;
    }
    this.targetItems.push(this.searchItem);
    this.searchItem = '';
  }

  removeItem(index){
    this.targetItems.splice(index,1);
  }

  seeResult(){
    this.itemService.getCheapestSinglePlace(this.targetItems).subscribe((res:any)=>{
      this.resultItems = res;
      this.notFound = [];
      if(res.length === 0){
        this.notFound = this.targetItems;
        return;
      }
      for(let i = 0; i < this.resultItems.length; i++){
        if(this.resultItems[i].id == 0){
          this.notFound.push(this.targetItems[i]);
        }
      }

      for(let i = 0; i < this.resultItems.length; i++){
        if(this.resultItems[i].id == 0){
          this.resultItems.splice(i, 1);
          i --;
        }
      }
      console.log(this.notFound);
    }, (err)=>{

    });
  }

  addAllToCart(){
    this.resultItems.map(item => item.quantity = 1);
    this.cartService.addMultipleToCart(this.resultItems, this.global.currentUser.id).subscribe((res:any)=>{
      this.global.cartItemsNo += res;
    }, (err)=>{

    });
  }

  removeResult(index){
    this.resultItems.splice(index,1);
  }

  addToCart(item){
    var toCart = {
          userId : this.global.currentUser.id,
          itemId : item.id,
          quantity: 1
        }
    
    this.cartService.addToCart(toCart).subscribe((res:any)=>{
      this.global.cartItemsNo ++;
    }, (err)=>{

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

}
