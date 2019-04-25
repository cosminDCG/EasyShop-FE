import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  updateUser(user) {
    return this.http.post('http://localhost:8090/user/update', user);
  }

  uploadProfilePicture(fileToUpload, id) {
    return this.http.post('http://localhost:8090/photo/upload?id=' + id, fileToUpload);
  }

  getPromosByUserId(userId){
    return this.http.get('http://localhost:8090/promo/user?user_id=' + userId);
  }

  getOrdersByUserId(userId){
    return this.http.get('http://localhost:8090/user/orders?user_id=' + userId);
  }

  getOrderItemsByOrderId(orderId){
    return this.http.get('http://localhost:8090/order/items?order_id=' + orderId);
  }

}
