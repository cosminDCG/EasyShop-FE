import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient) { }

  getShopOrdersPerWeek(shop){
    return this.http.get('http://localhost:8090/stats/shop/orders/week?shop=' + shop);
  }

  getShopOrdersPerMonth(shop){
    return this.http.get('http://localhost:8090/stats/shop/orders/month?shop=' + shop);
  }

  getShopOrdersPerYear(shop){
    return this.http.get('http://localhost:8090/stats/shop/orders/year?shop=' + shop);
  }

  getEasyOrdersPerWeek(){
    return this.http.get('http://localhost:8090/stats/easy/orders/week');
  }

  getEasyOrdersPerMonth(){
    return this.http.get('http://localhost:8090/stats/easy/orders/month');
  }

  getEasyOrdersPerYear(){
    return this.http.get('http://localhost:8090/stats/easy/orders/year');
  }
}
