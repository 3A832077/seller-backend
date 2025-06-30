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
import { FormComponent } from './form/form.component';
import { ProductsService } from './products.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-products',
  imports: [
              CommonModule, NzTableModule, NzButtonModule,
              NzModalModule, NzDividerModule, NzFormModule,
              NzInputModule, FormsModule, ReactiveFormsModule,
              NzIconModule
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

  categoryList: any[] = [];

  constructor(
                private modalService: NzModalService,
                private productsService: ProductsService
             ) { }

  ngOnInit(): void {
    this.getCategory();
  }

  /**
   * 取得產品類別
   */
  getCategory(){
    this.productsService.getCategories().pipe(
      tap((res) => {
        this.categoryList = res;
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    ).subscribe(() => {
      this.getProducts();
    });
  }

  /**
   * 取得產品列表
   * @param pageIndex
   * @param pageSize
   */
  getProducts(pageIndex: number = 1, pageSize: number = 10): void {
    const params = {
      _page: pageIndex,
      _limit: pageSize
    };
    this.loading = true;
    this.productsService.getProducts(params).pipe(
      tap((res: HttpResponse<any>) => {
        res.body.forEach((item: any) => {
          item.categoryName = this.categoryList.find((category) => Number(category.id) === Number(item.category))?.name;
        });
        this.displayedList = res.body;
        this.total = Number(res.headers.get('X-Total-Count'));
      }),
      catchError((error) => {
        this.loading = false;
        this.displayedList = [];
        this.total = 0;
        return EMPTY;
      })).subscribe(() => {
        this.loading = false;
      });
  }

  /**
   * 新增/編輯產品
   * @param isEdit
   * @param data
   */
  openModal(isEdit: boolean, data?: any): void {
    const modal = this.modalService.create({
      nzTitle: isEdit ? '編輯' : '新增',
      nzContent: FormComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzZIndex: 60,
      nzData: data
    });
    modal.afterClose.subscribe((res: any) => {
      if (res === 'success' ){
        this.getProducts();
      }
    });
  }

  /**
   * 刪除產品
   * @param id
   */
  deleteProduct(id: string): void {
    this.modalService.confirm({
      nzTitle: '確定要刪除嗎?',
      nzOnOk: () => {
        this.productsService.deleteProduct(id).pipe(
          tap(() => {
            this.getProducts();
          }),
          catchError((err) => {
            console.error(err);
            return EMPTY;
          })
        ).subscribe();
      }
    });
  }



}
