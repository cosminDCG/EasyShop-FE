import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  currentUser: any;
  currentProduct: any;

  chatUser: any;
  redirectUserProfile: any;

  cartItemsNo: any;
  wishItemsNo: any;

  searchString = '';

  serverUrl = 'http://localhost:8090/socket';
  stompClient;
  messages: any[] = [];
  constructor(private router: Router) { }

  toCompareFormat(price){
    
    if(price.includes("Lei")){
      var newPrice = price.slice(0,-3);
      newPrice = newPrice.replace(/\./g,'');
      newPrice = newPrice.replace(',','.');
      newPrice = parseFloat(newPrice);
    } else{
      var newPrice = price;
      newPrice = newPrice.replace(/\./g,'');
      newPrice = newPrice.replace(',','.');
      newPrice = parseFloat(newPrice);
    }
    return newPrice;
  }

  getCurrentDateAndTime(){
    var currentdate = new Date();
    return currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/" 
    + currentdate.getFullYear() + "  "  
    + currentdate.getHours() + ":"  
    + currentdate.getMinutes() + ":" 
    + currentdate.getSeconds();
  }

  deg2rad(degrees){
    var pi = Math.PI;
    return degrees * (pi/180);
  }

  distance(mark1, mark2){
    var R = 6371000; // metres
    var φ1 = this.deg2rad(mark1.lat);
    var φ2 = this.deg2rad(mark2.lat);
    var Δφ = this.deg2rad(mark2.lat - mark1.lat);
    var Δλ = this.deg2rad(mark2.lng - mark1.lng);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;

    return d;
  }

  formatItemName(name){
    if(name.length > 65)
      return name.substring(0,65) + "...";
    else return name;
  }

  seeItemDetails(item){
    this.currentProduct = item;
    this.router.navigate(['/item', item.id]);
  }

  capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
