import { Component, OnInit, HostListener } from '@angular/core';
import {
  IPayPalConfig,
  ICreateOrderRequest 
} from 'ngx-paypal';

import { GlobalService } from '../services/global-service/global.service';
import { CartService } from '../services/cart-service/cart.service';
import { BillService } from '../services/bill-service/bill.service';


import { ChartService } from '../services/chart-service/chart.service';


@Component({
  selector: 'app-rep-page',
  templateUrl: './rep-page.component.html',
  styleUrls: ['./rep-page.component.css']
})
export class RepPageComponent implements OnInit {

  public toChart = 1;
  public toOrder = 0;

  public changeChart = 0;

  public shopOrders: any[];
  public shopBills: any[];

  public currentBill: any;
  public billIndex: any;

  public currentOrder= {
    items: []
  };

  public payPalConfig ? : IPayPalConfig;

  public chartOptions = {
    responsive: true
  };

  public chartData :any[];
  public chartDataSet =[];
  public chartLabels: String[];
  public chartType: any;
  public options: any = {
    legend: { position: 'right' }
  }
  public chartTitle: any;
  public soldItemsNo: any;
  public ordersNo: any;

  public byOrders = 1;
  public toOverall = 0;

  public chartOptionsSet = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          stepSize: 100
        }
      }]
    },
    annotation: {
       drawTime: 'beforeDatasetsDraw',
       annotations: [{
          type: 'box',
          id: 'a-box-1',
          yScaleID: 'y-axis-0',
          yMin: 0,
          yMax: 1,
          backgroundColor: '#4cf03b'
       }, {
          type: 'box',
          id: 'a-box-2',
          yScaleID: 'y-axis-0',
          yMin: 1,
          yMax: 2.7,
          backgroundColor: '#fefe32'
       }, {
          type: 'box',
          id: 'a-box-3',
          yScaleID: 'y-axis-0',
          yMin: 2.7,
          yMax: 5,
          backgroundColor: '#fe3232'
       }]
    }
  }

  constructor(private global: GlobalService,
              private cartService: CartService,
              private billService: BillService,
              private chartService: ChartService) { 
               
              }

  ngOnInit() {
    this.initConfig();

    
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.global.currentUser = JSON.parse(aux);
    }

    this.shopOrdersPerWeekInit();

    this.cartService.allOrdersFromShop(this.global.currentUser.shop).subscribe((res:any)=>{
      this.shopOrders = res;
    }, (err)=>{

    });    

    this.billService.billsByShop(this.global.currentUser.shop).subscribe((res:any)=>{
      this.shopBills = res;
      console.log(this.shopBills);
    }, (err)=>{

    });
    
  }

  onChartClick(event) {
    console.log(event);
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AQHH61dTCD2iX4a093CiM4WJG3MNyDS6cuyKmHQLS7o9wdJFmsJuSpCMWqrTfyk1U61BT5f5I4NlZNTY',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: (this.currentBill.billValue/4.6).toFixed(2),
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: (this.currentBill.billValue/4.6).toFixed(2)
                        }
                    }
                },
                items: []
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });

        },
        onClientAuthorization: (data) => {
            this.payBill();
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
            
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
            

        },
        onError: err => {
            console.log('OnError', err);
            
        },
        onClick: () => {
            console.log('onClick');
            
        },
    };
}

  chartTab(){
    this.toChart = 1;
    this.toOrder = 0;
  }

  orderTab(){
    this.toChart = 0;
    this.toOrder = 1;
  }

  orderNumber(id){
    if(id < 10)
      return "0000" + id;
    if(id >= 10 && id < 100)
      return "000" + id;
    if(id >= 100 && id < 1000)
      return "00" + id;
    if(id >= 1000 && id <10000)
      return "0" + id;
    if(id >= 10000)
      return id;
  }

  showOrderDetails(order){
    this.currentOrder = order;
  }

  chooseBill(bill, index){
    this.currentBill = bill;
    this.billIndex = index;
  }

  payBill(){
    var payedBy = this.global.currentUser.firstName + " " + this.global.currentUser.lastName;
    this.billService.payBill(payedBy, this.currentBill.id).subscribe((res:any)=>{
      
    })
    this.currentBill.payed = 1;
    this.currentBill.payedBy = payedBy;
    this.currentBill.payDate = this.global.getCurrentDate();
    this.shopBills[this.billIndex] = this.currentBill;
  }

  chartsByOrders(){
    this.byOrders = 1;
    if(this.chartType === 'doughnut'){
      this.shopOrdersPerWeekInit();
    }

    if(this.chartType === 'pie'){
      this.shopOrdersPerMonthInit();
    }

    if(this.chartType === 'line'){
      this.shopOrdersPerYearInit();
    }
  }

  chartsByPrice(){
    this.byOrders = 0;
    if(this.chartType === 'doughnut'){
      this.shopPricePerWeekInit();
    }

    if(this.chartType === 'pie'){
      this.shopPricePerMonthInit();
    }

    if(this.chartType === 'line'){
      this.shopPricePerYearInit();
    }
  }

  shopOrdersPerWeekInit(){
    this.chartType = "doughnut";
    this.chartTitle = "Shop statistics from last week";
    this.changeChart = 0;
    this.chartService.getShopOrdersPerWeek(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartLabels = [];
      this.chartData = [];
      this.soldItemsNo = 0;
      this.ordersNo = 0;
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(res[i].date);
        this.soldItemsNo += res[i].quantity;
        this.chartData.push(res[i].stats);
        this.ordersNo += res[i].stats;
      }
        
    }, (err)=>{

    });
  }

  shopPricePerWeekInit(){
    this.chartType = "doughnut";
    this.chartTitle = "Shop statistics from last week";
    this.changeChart = 0;
    this.chartService.getShopPricePerWeek(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartLabels = [];
      this.chartData = [];
      this.soldItemsNo = 0;
      this.ordersNo = 0;
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(res[i].date);
        this.soldItemsNo += res[i].quantity;
        this.chartData.push(res[i].stats);
        this.ordersNo += res[i].stats;
      }
        
    }, (err)=>{

    });
  }

  shopOrdersPerMonthInit(){
    this.chartType = "pie";
    this.chartTitle = "Shop statistics from last month";
    this.changeChart = 0;
    this.chartService.getShopOrdersPerMonth(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartLabels = [];
      this.chartData = [];
      this.soldItemsNo = 0;
      this.ordersNo = 0;
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(res[i].date);
        this.soldItemsNo += res[i].quantity;
        this.chartData.push(res[i].stats);
        this.ordersNo += res[i].stats;
      }
        
    }, (err)=>{

    });
  }

  shopPricePerMonthInit(){
    this.chartType = "pie";
    this.chartTitle = "Shop statistics from last month";
    this.changeChart = 0;
    this.chartService.getShopPricePerMonth(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartLabels = [];
      this.chartData = [];
      this.soldItemsNo = 0;
      this.ordersNo = 0;
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(res[i].date);
        this.soldItemsNo += res[i].quantity;
        this.chartData.push(res[i].stats);
        this.ordersNo += res[i].stats;
      }
        
    }, (err)=>{

    });
  }

  shopOrdersPerYearInit(){
    this.chartType = "line";
    this.chartTitle = "Shop statistics from last year";
    this.changeChart = 1;
    this.chartService.getShopOrdersPerYear(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartLabels = [];
      this.chartDataSet = [{
        data: [],
        label: 'Orders',
        fill: true
      }];
      this.soldItemsNo = 0;
      this.ordersNo = 0;
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(this.global.getMonthName(res[i].date));
        this.soldItemsNo += res[i].quantity;
        this.chartDataSet[0].data.push(res[i].stats);
        this.ordersNo += res[i].stats;
      }
        
    }, (err)=>{

    });
  }

  shopPricePerYearInit(){
    this.chartType = "line";
    this.chartTitle = "Shop statistics from last year";
    this.changeChart = 1;
    this.chartService.getShopPricePerYear(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartLabels = [];
      this.chartDataSet = [{
        data: [],
        label: 'Orders',
        fill: true
      }];
      this.soldItemsNo = 0;
      this.ordersNo = 0;
      for(let i = 0; i < res.length; i++){
        this.chartLabels.push(this.global.getMonthName(res[i].date));
        this.soldItemsNo += res[i].quantity;
        this.chartDataSet[0].data.push(res[i].stats);
        this.ordersNo += res[i].stats;
      }
        
    }, (err)=>{

    });
  }

  shopStatsOverall(){
    this.chartTitle = "Shop overall statistics";
    this.chartType = 'doughnut';
    this.ordersNo = 0;
    this.soldItemsNo = 0;
    this.changeChart = 1;
    this.toOverall = 1;
    this.chartService.getShopStatsOverall(this.global.currentUser.shop).subscribe((res:any)=>{
      this.chartDataSet = [];
      this.chartLabels = ["Incomes", "Orders"];
      var aux1 = {
        data: []
      }
      var aux2 = {
        data: []
      }
      for(let i = 0; i < res.length; i++){
        this.soldItemsNo += res[i].quantity;
        this.ordersNo += res[i].stats2;
        
        aux1.data.push(res[i].stats);
        aux1.data.push(0);
        aux2.data.push(0);
        aux2.data.push(res[i].stats2);
        
      }
      this.chartDataSet.push(aux1);
      this.chartDataSet.push(aux2);

    },(err)=>{

    })
  }


}
