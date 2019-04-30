import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BanService {

  constructor(private http: HttpClient) { }

  addBan(ban){
    return this.http.post('http://localhost:8090/ban/add', ban);
  }
  
}
