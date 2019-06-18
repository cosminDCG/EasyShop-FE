import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient) { }

  allBills(){
    return this.http.get("http://localhost:8090/bill/all");
  }

  billsByShop(shop){
    return this.http.get("http://localhost:8090/bill/shop?shop=" + shop);
  }

  payBill(payedBy, billId){
    return this.http.post("http://localhost:8090/bill/pay?payedBy=" + payedBy + "&billId=" + billId, null);
  }
}
