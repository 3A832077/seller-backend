import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {

  apiUrl = `${env.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  /**
   * 取得所有訂單
   * @returns
   */
  getOrders(params: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
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
