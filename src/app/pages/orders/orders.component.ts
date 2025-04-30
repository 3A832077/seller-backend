import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { catchError, EMPTY, tap } from 'rxjs';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [
              CommonModule, NzTableModule, NzButtonModule,
              NzModalModule, NzDividerModule, NzFormModule,
              NzInputModule, FormsModule, ReactiveFormsModule,
              NzIconModule, RouterOutlet, RouterLink
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

  constructor(
                private modalService: NzModalService,
              ) { }

  ngOnInit(): void {
  }



}
