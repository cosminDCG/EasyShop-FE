import { Component, OnInit, HostListener, AfterViewChecked } from '@angular/core';
import { Router } from "@angular/router";

import { CartService } from '../services/cart-service/cart.service';
import { GlobalService } from '../services/global-service/global.service';
import { ToastrService } from 'ngx-toastr';
import { ItemService } from '../services/item-service/item.service';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public items = [];

  public discount = 0;
  public discountCode: any;
  public appliedPromo: any;
  public shippingFee = 0;

  public toCheckout = 0;
  public toAddress = 0;
  public cashPay = true;

  public deliveryPerson: any;
  public billingPerson: any;
  public deliveryAddress: any;
  public billingAddress: any;

  public changeDelivery = false;
  public changeBilling = false;

  public payPalConfig ? : IPayPalConfig;


  constructor(private global:GlobalService,
              private cartService:CartService,
              private router:Router,
              private toastrService:ToastrService) { }

  ngOnInit() {
    this.shippingFee = 0;

    this.initConfig();
    
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.global.currentUser = JSON.parse(aux);
    }

    this.cartService.getCartItems(this.global.currentUser.id).subscribe((res:any)=>{
      this.items = res;
      console.log(this.items);
    }, (err)=>{

    });

    this.deliveryPerson = this.global.currentUser.firstName + " " + this.global.currentUser.lastName;
    this.deliveryAddress = this.global.currentUser.address + ", " + this.global.currentUser.city;
    this.billingPerson = this.global.currentUser.firstName + " " + this.global.currentUser.lastName;
    this.billingAddress = this.global.currentUser.address + ", " + this.global.currentUser.city;
    console.log(this.global.currentUser);
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AQHH61dTCD2iX4a093CiM4WJG3MNyDS6cuyKmHQLS7o9wdJFmsJuSpCMWqrTfyk1U61BT5f5I4NlZNTY',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: (this.finalSum()/4.6).toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: (this.finalSum()/4.6).toFixed(2)
                        }
                    }
                },
                items: []
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            this.pay();
            this.router.navigate(['/items/categories']);
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            

        },
        onError: err => {
            console.log('OnError', err);
            
        },
        onClick: () => {
            console.log('onClick');
            
        },
    };
}

  totalSum(){
    var total = 0;
    for(let i=0; i < this.items.length; i++)
      total += this.global.toCompareFormat(this.items[i].price) * this.items[i].quantity;
    return total;
  }

  finalSum(){
    if(this.totalSum() - this.discount/100 * this.totalSum() < 300 && this.totalSum() - this.discount/100 * this.totalSum() !=0 ){
      this.shippingFee = 30;
    }else this.shippingFee = 0;
    return (this.totalSum() - this.discount/100 * this.totalSum() + this.shippingFee);
  }

  qtyPlus(index){
    this.items[index].quantity++;
  }

  qtyMinus(index){
    if(this.items[index].quantity > 0)
      this.items[index].quantity--;
  }

  deleteFromCart(cartId){
    this.cartService.deleteFromCart(cartId).subscribe((res:any)=>{

      this.items = this.items.filter(item => item.cartId !== cartId);

      this.global.cartItemsNo--;
      this.toastrService.error("","Removed from Cart");
    },(err)=>{

    });

  }

  backToCart(){
    if(this.toAddress == 1){
      this.toCheckout = 1;
      this.toAddress = 0;
    }
      
    if(this.toCheckout == 1)
      this.toCheckout = 0;
  }

  goToCheckout(){
    this.toCheckout = 1;
    console.log(this.items);
    this.cartService.updateCartQuantity(this.items).subscribe((res:any)=>{

    }, (err)=>{

    });
  }

  goToAddress(){
    this.toAddress = 1;
  }

  changeDeliveryInfo(){
    if(this.changeDelivery == false){
      this.changeDelivery = true;
      this.changeBilling = false;
    }
  }

  changeBillingInfo(){
    if(this.changeBilling == false){
      this.changeBilling = true;
      this.changeDelivery = false;
    }
  }

  applyCode(){
    var promo ={
      userId : this.global.currentUser.id,
      promoCode: this.discountCode
    }

    this.cartService.verifyCodeAndGetPercent(promo).subscribe((res:any)=>{
      this.appliedPromo = res;
      this.discount = this.appliedPromo.promoPercent;
    }, (err)=>{
      this.discount = 0;
    });

  }

  pay(){
    var order ={
      userId : this.global.currentUser.id,
      price : this.finalSum(),
      deliveryAddress : this.deliveryAddress,
      deliveryPerson : this.deliveryPerson,
      billingAddress : this.billingAddress,
      billingPerson : this.billingAddress,
      cashPay : this.cashPay
    }
    

    this.cartService.finishOrder(order).subscribe((res:any)=>{
      if(this.discount != 0){
        var promo={
          id : this.appliedPromo.id
        }
  
        this.cartService.useCode(promo).subscribe((res:any)=>{
  
        }, (err)=>{
  
        });
      }
      this.router.navigate(['/items/categories']);
    },(err)=>{

    });

    
    
  }
  
}
