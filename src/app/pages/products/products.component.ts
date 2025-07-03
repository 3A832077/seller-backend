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
import { FormComponent } from './form/form.component';
import { SupabaseService } from '../../service/supabase.service';

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
                private supabase: SupabaseService
             ) { }

  ngOnInit(): void {
    this.getCategory();
  }

  /**
   * 取得產品類別
   */
  getCategory(){
    this.supabase?.getCategories()?.then(({ data, error }) => {
      if (error) {
        console.error('取得產品類別失敗', error);
        return;
      }
      this.categoryList = data || [];
      this.getProducts();
    });
  }

  /**
   * 取得產品列表
   * @param pageIndex
   * @param pageSize
   */
  getProducts(pageIndex: number = 1, pageSize: number = 10){
    this.loading = true;
    this.supabase.getProducts(pageIndex, pageSize)?.then(({ data, error, count }) => {
      this.loading = false;
      if (error){
        console.error('取得產品列表失敗', error);
        this.loading = false;
        return;
      }
      this.total = count || 0;
      this.displayedList = data.map((item: any) => {
        item.categoryName = this.categoryList.find(category => category.id === item.category)?.name;
        return item;
      });
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
        this.supabase.deleteProduct(id)?.then(({ error }) => {
          if (error) {
            console.error('刪除失敗', error);
            return;
          }
          this.getProducts();
        });
      }
    });
  }



}
