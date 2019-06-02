import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../global-service/global.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private global: GlobalService) { }

  getUserById(id){
    return this.http.get('http://localhost:8090/user?id=' + id);
  }

  deleteUserById(id){
    return this.http.post('http://localhost:8090/user/delete?id=' + id, null);
  }

  changePassword(pass, newPass){
    return this.http.post('http://localhost:8090/user/password/change?email=' + this.global.currentUser.email + "&password=" + pass + "&newPassword=" + newPass, null);
  }

  getAllUsers(){
    return this.http.get('http://localhost:8090/user/all');
  }

  updateUserRole(id, role){
    return this.http.post('http://localhost:8090/user/role/update?id=' + id + '&role=' + role, null);
  }

  updateUserToRep(id, role, shop){
    return this.http.post('http://localhost:8090/user/rep/update?id=' + id + '&role=' + role + '&shop=' + shop, null);
  }

  insertRep(id, shop){
    return this.http.post('http://localhost:8090/rep/insert?id=' + id + "&shop=" + shop, null);
  }

  getShopRep(shop){
    return this.http.get('http://localhost:8090/rep?shop=' + shop);
  }

  deleteRep(shop){
    return this.http.post('http://localhost:8090/rep/delete?shop=' + shop, null);
  }

  getShopByRepId(id){
    return this.http.get('http://localhost:8090/rep/shop?id=' + id);
  }
}
