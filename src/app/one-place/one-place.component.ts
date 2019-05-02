import { Component, OnInit, HostListener } from '@angular/core';
import { GlobalService } from '../services/global-service/global.service';
import { ItemService } from '../services/item-service/item.service';
import { CartService } from '../services/cart-service/cart.service';

@Component({
  selector: 'app-one-place',
  templateUrl: './one-place.component.html',
  styleUrls: ['./one-place.component.css']
})
export class OnePlaceComponent implements OnInit {

  public searchItem: any;
  public targetItems: any = [];
  public resultItems: any;

  constructor(private global: GlobalService,
              private itemService: ItemService,
              private cartService: CartService) { }

  ngOnInit() {
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
      console.log(this.resultItems);
    }, (err)=>{

    });
  }

  addAllToCart(){
    this.resultItems.map(item => item.quantity = 1);
    this.cartService.addMultipleToCart(this.resultItems, this.global.currentUser.id).subscribe((res:any)=>{
      this.global.cartItemsNo += this.resultItems.length;
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

}
