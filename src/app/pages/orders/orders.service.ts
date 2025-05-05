import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
                private http: HttpClient
             ) {}

  apiUrl = `${env.apiUrl}/orders`;

  /**
   * 取得所有訂單
   * @returns
   */
  getOrders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /**
   * 編輯訂單狀態
   */
  editOrder(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /**
   * 編輯訂單評價
   */
  editOrderRate(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, data);
  }

}
