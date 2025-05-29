import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../env/environment';
import { prodEnv } from '../../env/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  apiUrl = `${env.production ? prodEnv.apiUrl : env.apiUrl}/chart`;

  constructor(private http: HttpClient) {}

  /**
   * 取得所有圖表資料
   * @returns
   */
  getCharts() {
    return this.http.get(this.apiUrl);
  }
}
