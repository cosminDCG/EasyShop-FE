import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cheapest-prod',
  templateUrl: './cheapest-prod.component.html',
  styleUrls: ['./cheapest-prod.component.css']
})
export class CheapestProdComponent implements OnInit {

  public searchItem: any;
  public targetItems: any = [];

  constructor() { }

  ngOnInit() {
  }

  addItem(){
    this.targetItems.push(this.searchItem);
    console.log(this.targetItems);
  }

}
