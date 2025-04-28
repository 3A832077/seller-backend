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
import { FormComponent } from './form/form.component';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  imports: [
              CommonModule, NzTableModule, NzButtonModule,
              NzModalModule, NzDividerModule, NzFormModule,
              NzInputModule, FormsModule, ReactiveFormsModule,
              NzIconModule, RouterOutlet, RouterLink
           ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {

  displayedList: any[] = [];

  total: number = 0;

  pageIndex: number = 1;

  pageSize: number = 10;

  loading: boolean = false;

  constructor(
                private modalService: NzModalService,
                private productsService: ProductsService
             ) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.loading = true;
    this.productsService.getProducts().pipe(
      tap((res) => {
        this.displayedList = res;
        this.loading = false;
      }),
      catchError((err) => {
        console.error(err);
        this.loading = false;
        return EMPTY;
      })
    ).subscribe();
  }

  openModal(): void {
    const modal = this.modalService.create({
      nzTitle: '新增',
      nzContent: FormComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzZIndex: 60,
    });
  }

}
