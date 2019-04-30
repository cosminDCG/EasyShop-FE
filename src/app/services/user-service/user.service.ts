import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserById(id){
    return this.http.get('http://localhost:8090/user?id=' + id);
  }

  deleteUserById(id){
    return this.http.post('http://localhost:8090/user/delete?id=' + id, null);
  }

  getAllUsers(){
    return this.http.get('http://localhost:8090/user/all');
  }
}
