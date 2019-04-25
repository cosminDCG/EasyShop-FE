import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  scrapLink(link){
    return this.http.post("http://localhost:8090/scrap?page=" + link, null);
  }
}

