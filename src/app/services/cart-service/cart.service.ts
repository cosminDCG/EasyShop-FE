import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }

  addToCart(toCart){
    return this.http.post('http://localhost:8090/order/cart/insert?user_id=' + toCart.userId + '&item_id=' + toCart.itemId + '&quantity=' +toCart.quantity, null);
  }

  addMultipleToCart(toCart, userId){
    return this.http.post('http://localhost:8090/order/cart/insert/multiple?user_id=' + userId, toCart);
  }

  getCartItems(userId){
    return this.http.get('http://localhost:8090/order/cart/items?user_id=' + userId);
  }

  finishOrder(order){
    return this.http.post('http://localhost:8090/order/update', order);
  }

  deleteFromCart(cartId){
    return this.http.post('http://localhost:8090/order/cart/delete?cart_id=' + cartId, null);
  }

  updateCartQuantity(cart){
    return this.http.post('http://localhost:8090/user/cart/update', cart);
  }

  verifyCodeAndGetPercent(promo){
    return this.http.get('http://localhost:8090/promo/verify?userId=' + promo.userId + '&promoCode=' + promo.promoCode);
  }

  useCode(promo){
    return this.http.post('http://localhost:8090/promo/use', promo);
  }

}
