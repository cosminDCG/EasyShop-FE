import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  itemProperties(id){
    return this.http.get('http://localhost:8090/item/properties?id=' + id);
  }

  getCheapestChoices(criterias){
    return this.http.post('http://localhost:8090/item/cheapest', criterias);
  }

  getCheapestSinglePlace(criterias){
    return this.http.post('http://localhost:8090/item/single', criterias)
  }
}
