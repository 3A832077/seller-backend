import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  constructor(private http: HttpClient) {}

  apiUrl = `${env.apiUrl}/products`;

  apiUrl2 = `${env.apiUrl}/category`;

  /**
   * 取得所有產品
   * @returns
   */
  getProducts(params: any): Observable<any> {
    return this.http.get(this.apiUrl, { params, observe: 'response' });
  }

  /**
   * 取得所有產品類別
   * @returns
   */
  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl2);
  }

  /**
   * 新增產品
   * @param data
   * @returns
   */
  addProduct(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  /**
   * 更新產品
   * @param id
   * @param data
   * @returns
   */
  editProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  /**
   * 刪除產品
   * @param id
   * @returns
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // uploadImage(file: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Authorization': 'Client-ID 9518869630fb48f',
  //     'Content-Type': 'multipart/form-data',
  //   });
  //   return this.http.post<any>('https://api.imgur.com/3/image', file, { headers });
  // }
}
