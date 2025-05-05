import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from '../../env/env';

@Injectable({
  providedIn: 'root'
})
export class InspectionsService {

  apiUrl = `${env.apiUrl}/inspections`;

  constructor(
    private http: HttpClient
  ) { }

  /**
   * 取得所有檢查項目
   * @returns
   */
  getInspections(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

}
