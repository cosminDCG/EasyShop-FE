import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InboxService {

  constructor(private http: HttpClient) { }

  getConversation(from_user, to_user){
    return this.http.get('http://localhost:8090/conversation?from_user=' + from_user + '&to_user=' + to_user);
  }
}
