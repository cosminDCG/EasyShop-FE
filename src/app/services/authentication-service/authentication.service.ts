import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  register(user) {
    return this.http.post('http://localhost:8090/register', user);
  }

  login(user) {
    return this.http.get('http://localhost:8090/login?email=' + user.email + '&password=' + user.password);
  }

  logout() {
    return this.http.get('http://localhost:8090/user/signout');
  }

  recoverAccount(email) {
    return this.http.post('http://localhost:8090/user/recover?email=' + email, null);
  }

}
