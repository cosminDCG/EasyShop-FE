import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from "@angular/router";

import { GlobalService } from '../services/global-service/global.service';
import { ItemService } from '../services/item-service/item.service';
import { ReviewService } from '../services/review-service/review.service';
import { UserService } from '../services/user-service/user.service';
import { CartService } from '../services/cart-service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  public currentProduct:any;
  public currentProductProperties:any;
  public currentUser: any;

  public quantity = 1;
  public rating = 0;
  public comment: any;
  public currentProductReviews: any;

  public toggleReply :any[]=[];
  public toggleReviewReplies :any[] = [];
  public replyText: any;

  public allowReview = 1;

  constructor(private global:GlobalService,
              private itemService:ItemService,
              private reviewService:ReviewService,
              private userService:UserService,
              private router: Router,
              private cartService : CartService,
              private toastrService: ToastrService) { }

  ngOnInit() {
    if(localStorage.getItem('crUser') && this.global.currentUser == null) {
      var aux = localStorage.getItem('crUser');
      this.global.currentUser = JSON.parse(aux);
      this.currentUser = this.global.currentProduct;
    }

    if(localStorage.getItem('crProd') && this.global.currentProduct == null) {
      var aux1 = localStorage.getItem('crProd');
      this.global.currentProduct = JSON.parse(aux1);
      this.currentProduct = this.global.currentProduct;
    }

    this.currentProduct = this.global.currentProduct;
    this.currentUser = this.global.currentUser;

    this.itemService.itemProperties(this.currentProduct.id).subscribe((res:any)=>{
      this.currentProductProperties = res;
    }, (err) =>{
      console.log('Error');
    });
    
    this.reviewService.getReviewsByItemId(this.currentProduct.id).subscribe((res:any)=>{
      this.currentProductReviews = res;
      var count = 0;
      count = this.currentProductReviews.filter(review => review.userId === this.currentUser.id).length;
      console.log(count);
      if(count !== 0){
        this.allowReview = 0;
        console.log(this.allowReview);
      }
        
    }, (err) =>{
      console.log('Error');
    });
  }

  @HostListener('window:beforeunload') saveUser() {
    localStorage.setItem('crUser', JSON.stringify(this.global.currentUser));
    localStorage.setItem('crProd',JSON.stringify(this.global.currentProduct));
  }

  getUrl(){
    return "url(..\..\assets\dashboard\'"+ this.currentProduct.photo + "')";
  }

  minusQty(){
    if(this.quantity == 1)
      return;
    this.quantity--;
  }

  plusQty(){
    this.quantity++;
  }

  giveRating(index){
    this.rating = index;
  }

  addReview(){
    var review = {
      productId : this.global.currentProduct.id,
      userId: this.global.currentUser.id,
      firstName: this.global.currentUser.firstName,
      lastName: this.global.currentUser.lastName,
      photo: this.global.currentUser.photo,
      comment: this.comment,
      review: this.rating,
      replyTo: 0,
      data: this.global.getCurrentDateAndTime()
    }

    this.reviewService.insertReview(review).subscribe((res:any)=>{
      this.comment = "";
      this.rating = 0;
      this.allowReview = 0;
      this.reviewService.getReviewsByItemId(this.currentProduct.id).subscribe((res:any)=>{
        this.currentProductReviews = res;
        console.log(this.currentProductReviews);
      }, (err) =>{
        console.log('Error');
      });
    }, (err) =>{
      console.log('Error');
    })
  }

  reviewReplyToggle(index){
    if(this.toggleReply.includes(index)){
      var toDelete = this.toggleReply.indexOf(index);
      this.toggleReply.splice(toDelete, 1);
    }
      else this.toggleReply.push(index);
  }

  showReplies(index){
    if(this.toggleReviewReplies.includes(index)){
      var toDelete = this.toggleReviewReplies.indexOf(index);
      this.toggleReviewReplies.splice(toDelete, 1);
    }
      else this.toggleReviewReplies.push(index);
  }

  addReply(index, id){
    var review = {
      productId : this.global.currentProduct.id,
      userId: this.global.currentUser.id,
      firstName: this.global.currentUser.firstName,
      lastName: this.global.currentUser.lastName,
      photo: this.global.currentUser.photo,
      comment: this.replyText,
      review: 0,
      replyTo: id,
      data: this.global.getCurrentDateAndTime()
    }

    this.reviewService.insertReview(review).subscribe((res:any)=>{
      this.reviewService.getReviewsByItemId(this.currentProduct.id).subscribe((res:any)=>{
        this.currentProductReviews = res;
        console.log(this.currentProductReviews);
      }, (err) =>{
        console.log('Error');
      });
    }, (err) =>{
      console.log('Error');
    })
  }

  addToCart(itemId){
    var toCart = {
      userId: this.currentUser.id,
      itemId: itemId,
      quantity: this.quantity
    }

    console.log(toCart);

    this.cartService.addToCart(toCart).subscribe((res:any)=>{
      if(res == true){
        this.global.cartItemsNo++;
      }
      this.quantity = 1;
      this.toastrService.success("", "Added to Cart");
    }, (err)=>{
      console.log("Error");
    });
  }

  deleteReview(id){
    this.reviewService.deleteReviewById(id).subscribe((res:any)=>{
      this.reviewService.getReviewsByItemId(this.currentProduct.id).subscribe((res:any)=>{
        this.currentProductReviews = res;
        var count = 0;
        count = this.currentProductReviews.filter(review => review.userId === this.currentUser.id).length;
        if(count !== 0){
          this.allowReview = 0;
          console.log(this.allowReview);
        }
        else this.allowReview = 1;
      }, (err) =>{
        console.log('Error');
      });
    }, (err)=>{

    });
  }

  deleteReply(id, index, replyIndex){
    this.reviewService.deleteReviewById(id).subscribe((res:any)=>{
      this.reviewService.getReviewsByItemId(this.currentProduct.id).subscribe((res:any)=>{
        this.currentProductReviews = res;
        console.log(this.currentProductReviews);
      }, (err) =>{
        console.log('Error');
      });
    }, (err)=>{

    });
  }

  goToUserProfile(id){
    this.userService.getUserById(id).subscribe((res:any)=>{
      this.global.redirectUserProfile = res;
      this.router.navigate(['/profile', this.global.redirectUserProfile.id]);
    }, (err) =>{
      console.log('Error');
    })
  }
}
