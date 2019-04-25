import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { GlobalService } from '../services/global-service/global.service';
import { ProfileService } from '../services/user-page-service/profile.service';
import { UserService } from '../services/user-service/user.service';


@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  public uploadLabel: string;
  public selectedFile: string;
  public editMode = false;
  public user: any={};
  public profilePhotoUrl: any;
  public readyToUpload = false;

  public nrOfOrders = 0;
  public nrOfReviews = 0;
  public nrOfComments = 0;

  public promos: any;
  public orders: any;

  public currentOrder: any;
  public currentOrderPrice: any;
  public currentOrderItems: any;

  constructor(private profileService: ProfileService, 
              private global: GlobalService,
              private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.uploadLabel = 'Choose your photo';

    if(this.global.redirectUserProfile!=null)
      if(this.global.redirectUserProfile.id == this.global.currentUser)
        this.user = this.global.currentUser;
        else this.user = this.global.redirectUserProfile;
      else this.user = this.global.currentUser;

    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.user = JSON.parse(aux);
      this.global.currentUser = this.user;
      console.log(this.user);
    }

    if(this.user.photo === null){
      this.user.photo = 'avatar.png';
      console.log(this.user);
    }

    this.profileService.getPromosByUserId(this.user.id).subscribe((res:any)=>{
      this.promos = res;
      console.log(this.promos);
    }, (err)=>{

    });

    this.profileService.getOrdersByUserId(this.user.id).subscribe((res:any)=>{
      this.orders = res;
      if(this.orders != null)
        this.nrOfOrders = this.orders.length;
      console.log(this.orders);
    }, (err)=>{

    });

  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));

  }

  pathChange(event) {
    this.uploadLabel = this.selectedFile.split(String.fromCharCode(92))[2];
    this.readyToUpload = true;
    let formData = new FormData();
    formData.append('file', event.srcElement.files[0]);
    this.profileService.uploadProfilePicture(formData,this.user.id).subscribe((res:any)=>{
      
    }, (err) =>{
      console.log('Error');
    });
  }

  enableEditMode() {
    this.editMode = true;
  }

  saveChanges() {
    this.editMode = false;
    var modifiedUser = this.user;
    console.log(modifiedUser);
    this.profileService.updateUser(modifiedUser).subscribe((res:any)=>{
      console.log('Success');
    }, (err) =>{
      console.log('Error');
    });
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
    this.currentOrder = this.orderNumber(order.id);
    this.currentOrderPrice = order.price;
    this.profileService.getOrderItemsByOrderId(order.id).subscribe((res:any)=>{
      this.currentOrderItems = res;
    }, (err)=>{

    });
  }

  deleteUser(id){
    this.userService.deleteUserById(id).subscribe((res:any)=>{
      $('.modal-backdrop').remove();
      this.router.navigate(['/authentication']);
    }, (err)=>{

    });
  }

  formatItemName(name){
    if(name.length > 65)
      return name.substring(0,65) + "...";
    else return name;
  }

}
