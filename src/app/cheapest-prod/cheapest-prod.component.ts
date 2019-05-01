import { Component, OnInit, HostListener } from '@angular/core';
import { ItemService } from '../services/item-service/item.service';
import { GlobalService } from '../services/global-service/global.service';

@Component({
  selector: 'app-cheapest-prod',
  templateUrl: './cheapest-prod.component.html',
  styleUrls: ['./cheapest-prod.component.css']
})
export class CheapestProdComponent implements OnInit {

  public searchItem: any;
  public targetItems: any = [];

  public choices: any;

  constructor(private itemService: ItemService,
              private global: GlobalService) { }

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

  getCheapestChoices(){
    this.itemService.getCheapestChoices(this.targetItems).subscribe((res:any)=>{
      this.choices = res;
      console.log(this.choices);
    }, (err)=>{

    });
  }

}
