import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { GlobalService } from './services/global-service/global.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'EasyShop';

  constructor(private elementRef: ElementRef,
              private global: GlobalService){
    this.initializeWebSocketConnection();

  }
  ngAfterViewInit(){
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = 'rgb(245,245,245)';
 }

 initializeWebSocketConnection(){
  let ws = new SockJS(this.global.serverUrl);
  this.global.stompClient = Stomp.over(ws);
  let that = this;
  this.global.stompClient.connect({}, function(frame) {
    that.global.stompClient.subscribe("/chat", (message) => {
      
      if(message.body) {
        that.global.messages.push(JSON.parse(message.body));
      }
    });
  });
  
}
}
