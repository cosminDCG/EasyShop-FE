import { Component, OnInit, HostListener } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import { GlobalService } from '../services/global-service/global.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  public chatUser: any;
  public messages = [];

  public messageText = '';

  
  public received = '';


  constructor(private global: GlobalService) {
    
   }

  ngOnInit() {
    this.chatUser = this.global.chatUser;
    console.log(this.chatUser);

    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser'); 
      this.global.currentUser = JSON.parse(aux);
      var auxChat = localStorage.getItem('crChat');
      this.global.chatUser = JSON.parse(auxChat);
      this.chatUser = this.global.chatUser;
    }
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
    localStorage.setItem('crChat', JSON.stringify(this.global.chatUser));
  }

  

  getMessage(){
    this.messages.push($(".currentMessage").val());
    console.log(this.messages);
  }

  sendMessage(){
    this.global.stompClient.send("/app/send/message" , {}, JSON.stringify(this.messageText));
    this.messageText = '';
  }


}
