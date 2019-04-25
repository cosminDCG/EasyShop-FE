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
  public hideWarningTakenEmail =true;

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
  }

  onSignUp(){

    var ok = 0;
    if(this.password != this.repeatPassword){
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
    var user = {
      email: this.logEmail,
      password: this.logPassword
    }
    this.authService.login(user).subscribe((res:any)=>{
      this.global.currentUser = res;
      console.log(this.global.currentUser);
      this.router.navigate(['/dashboard']);
    }, (err) => {
      console.log('Error');
    });
  }

}
