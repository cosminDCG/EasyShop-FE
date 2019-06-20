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

  getShopPricePerWeek(shop){
    return this.http.get('http://localhost:8090/stats/shop/price/week?shop=' + shop);
  }

  getShopPricePerMonth(shop){
    return this.http.get('http://localhost:8090/stats/shop/price/month?shop=' + shop);
  }

  getShopPricePerYear(shop){
    return this.http.get('http://localhost:8090/stats/shop/price/year?shop=' + shop);
  }

  getShopStatsOverall(shop){
    return this.http.get('http://localhost:8090/stats/shop/overall?shop=' + shop);
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

  getEasyPricePerWeek(){
    return this.http.get('http://localhost:8090/stats/easy/price/week');
  }

  getEasyPricePerMonth(){
    return this.http.get('http://localhost:8090/stats/easy/price/month');
  }

  getEasyPricePerYear(){
    return this.http.get('http://localhost:8090/stats/easy/price/year');
  }

  getEasyStatsOverall(){
    return this.http.get('http://localhost:8090/stats/easy/overall');
  }
}
