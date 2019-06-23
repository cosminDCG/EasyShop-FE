import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { GlobalService } from '../services/global-service/global.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  signUpStyle: string;
  loginStyle: string;
  public signedIn = false;

  public hideWarningPass = true;
  public hideWarningEmail = true;
  public hideWarningTakenEmail = true;
  public hideWarningFirstName = true;
  public hideWarningLastName = true;
  public hideWarningAddress = true;
  public hideWarningCity = true;
  public hideWarningPhoneNumber = true;
  public hideWarningPassword = true;
  public agreeTerms = false;
  public hideAgreeTerms = true;

  public hideWarningLogEmail = true;
  public hideWarningLogPass = true;
  public hideWarningLogError = true;

  public hideWarningRecEmail = true;

  public email: string;
  public password: string;
  public repeatPassword: string;
  public firstName: string;
  public lastName: string;
  public address: string;
  public city: string;
  public phoneNumber: string;

  public logEmail: string;
  public logPassword: string;

  public recoveryEmail: string;
  public forgotPass = 0;

  public click = 0;

  constructor(private authService:AuthenticationService, 
              private global:GlobalService, 
              private router: Router) { }

  ngOnInit() {
    this.signUpStyle = "col-md-6 sign-up-clicked";
    this.loginStyle = "col-md-6 login";
  }

  changeToSignUp(){
    this.signUpStyle = "col-md-6 sign-up-clicked";
    this.loginStyle = "col-md-6 login";
    this.signedIn = false;
  }

  changeToLogin(){
    this.signUpStyle = "col-md-6 sign-up";
    this.loginStyle = "col-md-6 login-clicked";
    this.signedIn = true;
    this.forgotPass = 0;
  }

  agreeWithTerms(){
    this.agreeTerms = !this.agreeTerms;
  }

  toForgotPass(){
    this.forgotPass = 1;
  }

  backToLogin(){
    this.forgotPass = 0;
  }

  recoverAccount(){
    this.authService.recoverAccount(this.recoveryEmail).subscribe((res:any)=>{
      this.forgotPass = 0;
      this.hideWarningRecEmail = true;
    },(err)=>{
      this.hideWarningRecEmail = false;
    });
  }

  onSignUp(){

    var ok = 0;
    if(this.password != this.repeatPassword || this.password.length < 8){
      this.hideWarningPass = false;
      ok = 1;
    } else{
      this.hideWarningPass = true;
    }

    if(this.email.includes("@") == false || this.email.includes(".") == false){
      this.hideWarningEmail = false;
      ok = 1;
    } else{
      this.hideWarningEmail = true;
    }

    if(this.firstName === "" || this.firstName === undefined){
      this.hideWarningFirstName = false;
      ok = 1;
    } else if(!(this.firstName.replace(/\s/g, '').length)){
      this.hideWarningFirstName = false;
      ok = 1;
      
    }else{
      this.hideWarningFirstName = true;
    }

    if(this.lastName === "" || this.lastName === undefined){
      this.hideWarningLastName = false;
      ok = 1;
    } else if(!(this.lastName.replace(/\s/g, '').length)){
      this.hideWarningLastName = false;
      ok = 1;
    } else{
      this.hideWarningLastName = true;
    }

    if(this.address === "" || this.address === undefined){
      this.hideWarningAddress = false;
      ok = 1;
    } else if(!(this.address.replace(/\s/g, '').length)){
      this.hideWarningAddress = false;
      ok = 1;
    } else{
      this.hideWarningAddress = true;
    }

    if(this.agreeTerms === false){
      this.hideAgreeTerms = false;
      ok = 1;
    }else{
      this.hideAgreeTerms = true;
    }

    if(this.city === "" || this.city === undefined){
      this.hideWarningCity = false;
      ok = 1;
    } else if(!(this.city.replace(/\s/g, '').length)){
      this.hideWarningCity = false;
      ok = 1;
    } else{
      this.hideWarningCity = true;
    }

    if(this.phoneNumber === "" || this.phoneNumber === undefined){
      this.hideWarningPhoneNumber = false;
      ok = 1;
    } else if(!(this.phoneNumber.replace(/\s/g, '').length)){
      this.hideWarningPhoneNumber = false;
      ok = 1;
    } else{
      this.hideWarningPhoneNumber = true;
    }

    if(this.password === "" || this.password === undefined){
      this.hideWarningPassword = false;
      ok = 1;
    } else if(!(this.password.replace(/\s/g, '').length)){
      this.hideWarningPassword = false;
      ok = 1;
    } else{
      this.hideWarningPassword = true;
    }

    if(ok == 1){
      return;
    } else {
        var user = {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          address: this.address,
          city: this.city,
          phoneNumber: this.phoneNumber,
          password: this.password
        }
        this.authService.register(user).subscribe((res:any)=>{
          this.changeToLogin();
        }, (err) =>{
          this.hideWarningTakenEmail = false;
        });
    }
  }

  onLogin() {
    var ok = 0;
    
    if(this.logEmail === "" || this.logEmail === undefined){
      this.hideWarningLogEmail = false;
      ok = 1;
    } else if(!(this.logEmail.replace(/\s/g, '').length)){
      this.hideWarningLogEmail = false;
      ok = 1;
    } else{
      this.hideWarningLogEmail = true;
    }

    if(this.logPassword === "" || this.logPassword === undefined){
      this.hideWarningLogPass = false;
      ok = 1;
    } else if(!(this.logPassword.replace(/\s/g, '').length)){
      this.hideWarningLogPass = false;
      ok = 1;
    } else{
      this.hideWarningLogPass = true;
    }

    if(ok == 1){
      return;
    }else{
      var user = {
        email: this.logEmail,
        password: this.logPassword
      }

      this.authService.login(user).subscribe((res:any)=>{
        if(this.click !== 0){
          this.click = 0;
          return;
        }
          
        this.global.currentUser = res;
        this.hideWarningLogError = true;
        if(this.global.currentUser.ban.id !== 0){
          document.getElementById("openModalButton").click();
          this.click ++;
          return;
        }else{
          this.router.navigate(['/items/categories']);
        }
      }, (err) => {
        this.hideWarningLogError = false;
      });
    }
  }

}
