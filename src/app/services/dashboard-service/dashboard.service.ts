import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  allItems() {
    return this.http.get('http://localhost:8090/item/all');
  }

  allCategories() {
    return this.http.get('http://localhost:8090/item/categories');
  }
}
