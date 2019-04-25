import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  insertReview(review){
    return this.http.post('http://localhost:8090/review/insert', review);
  }

  getReviewsByItemId(id){
    return this.http.get('http://localhost:8090/review/all?id=' + id);
  }

  deleteReviewById(id){
    return this.http.post('http://localhost:8090/review/delete?id=' + id, null)
  }
}
