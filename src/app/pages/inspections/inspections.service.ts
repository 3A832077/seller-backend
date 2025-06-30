import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/environment';

@Injectable({
  providedIn: 'root',
})
export class InspectionsService {

  apiUrl = `${env.apiUrl}/inspections`;

  constructor(private http: HttpClient) {}

  /**
   * 取得所有檢查項目
   * @returns
   */
  getInspections(params: any): Observable<any> {
    return this.http.get(this.apiUrl, { params, observe: 'response' });
  }

  /**
   * 新增檢查項目
   * @param data
   * @returns
   */
  addInspection(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
