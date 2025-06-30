import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { catchError, EMPTY, tap } from 'rxjs';
import { RouterOutlet, RouterLink } from '@angular/router';
import { OrdersService } from './orders.service';
import { NzRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'app-orders',
  imports: [
              CommonModule, NzTableModule, NzButtonModule,
              NzModalModule, NzDividerModule, NzFormModule,
              NzInputModule, FormsModule, ReactiveFormsModule,
              NzIconModule, NzRateModule
           ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {

  displayedList: any[] = [];

  total: number = 0;

  pageIndex: number = 1;

  pageSize: number = 10;

  loading: boolean = false;

  statusMap: any = {
    '0': '新成立',
    '1': '確認',
    '2': '備貨中',
    '3': '已出貨',
    '4': '已送達',
    '5': '已完成',
    '6': '退貨中',
    '7': '已取消',
  };

  constructor(
                private ordersService: OrdersService,
              ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  /**
   * 取得訂單列表
   * @param pageIndex
   * @param pageSize
   */
  getOrders(pageIndex: number = 1, pageSize: number = 10) {
    const params = {
      _page: pageIndex,
      _limit: pageSize
    }
    this.loading = true;
    this.ordersService.getOrders(params).pipe(
      tap((res) => {
        this.displayedList = res;
        this.total = Number(res.headers.get('X-Total-Count'));
      }),
      catchError((err) => {
        this.displayedList = [];
        this.total = 0;
        return EMPTY;
      })
    ).subscribe(() => {
      this.loading = false;
    });
  }







}
