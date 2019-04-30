import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PromoService {

  constructor(private http: HttpClient) { }

  setCustomPromo(promo){
    return this.http.post('http://localhost:8090/promo/custom', promo);
  }
}
