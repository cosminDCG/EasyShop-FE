import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(private http: HttpClient) { }

  insertBlock(shop){
    return this.http.post('http://localhost:8090/block/insert?shop=' + shop, null);
  }

  deleteBlock(shop){
    return this.http.post('http://localhost:8090/block/delete?shop=' + shop, null);
  }

  getBlockedShops(){
    return this.http.get('http://localhost:8090/block/all');
  }
}
