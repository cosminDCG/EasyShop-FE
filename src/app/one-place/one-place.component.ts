import { Component, OnInit, HostListener } from '@angular/core';
import { GlobalService } from '../services/global-service/global.service';
import { ItemService } from '../services/item-service/item.service';

@Component({
  selector: 'app-one-place',
  templateUrl: './one-place.component.html',
  styleUrls: ['./one-place.component.css']
})
export class OnePlaceComponent implements OnInit {

  public searchItem: any;
  public targetItems: any = [];
  public resultItems: any;

  constructor(private global: GlobalService,
              private itemService: ItemService) { }

  ngOnInit() {
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.global.currentUser = JSON.parse(aux);
    }
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
  }

  addItem(){
    this.targetItems.push(this.searchItem);
    this.searchItem = '';
  }

  removeItem(index){
    this.targetItems.splice(index,1);
  }

  seeResult(){
    this.itemService.getCheapestSinglePlace(this.targetItems).subscribe((res:any)=>{
      this.resultItems = res;
      console.log(this.resultItems);
    }, (err)=>{

    });
  }

}
