import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient) { }

  insertWishItem(wishItem){
    return this.http.post('http://localhost:8090/wishlist/insert', wishItem);
  }

  getWishItemsForUser(userId){
    return this.http.get('http://localhost:8090/wishlist/item?user_id=' + userId);
  }

  deleteWishItem(wishId){
    return this.http.post('http://localhost:8090/wishlist/delete?wish_id=' + wishId, null);
  }
}
