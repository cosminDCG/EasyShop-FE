import { Component, OnInit, HostListener } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

import { GlobalService } from '../services/global-service/global.service';
import { InboxService } from '../services/inbox-service/inbox.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  public chatUser: any;
  public messages = [];

  public messageText = '';
  public chatHistory: any[];

  
  public received = '';


  constructor(private global: GlobalService,
              private inboxService: InboxService) {
    
   }

  ngOnInit() {
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser'); 
      this.global.currentUser = JSON.parse(aux);
      var auxChat = localStorage.getItem('crChat');
      if(this.global.chatUser == null && aux !== null){
        this.global.chatUser = JSON.parse(auxChat);
        this.chatUser = this.global.chatUser;
      }
      
    }

    this.inboxService.getChatHistory(this.global.currentUser.id).subscribe((res:any)=>{
      this.chatHistory = res;
      console.log(this.chatHistory);
      if(this.global.chatUser == undefined){
        this.global.chatUser = this.chatHistory[this.chatHistory.length - 1].user;
        this.chatUser = this.global.chatUser;
      }
    })

    this.inboxService.getConversation(this.global.currentUser.id, this.chatUser.id).subscribe((res:any)=>{
      this.global.messages = res;
    })
    
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
    localStorage.setItem('crChat', JSON.stringify(this.global.chatUser));
  }


  sendMessage(){
    var message = {
      fromUser : this.global.currentUser.id,
      toUser : this.chatUser.id,
      text : this.messageText
    }
    this.global.stompClient.send("/app/send/message" , {}, JSON.stringify(message));
    this.messageText = '';
  }

  changeChatUser(message){
    this.global.chatUser = message.user;
    this.chatUser = message.user;
    this.global.messages = message.conversation;
  }


}
