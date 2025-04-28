import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  apiUrl = `${env.apiUrl}/products`;

  apiUrl2 = `${env.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.apiUrl2);
  }


}
