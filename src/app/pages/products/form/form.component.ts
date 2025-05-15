import { Component, inject, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ProductsService } from '../products.service';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'products-form',
  imports: [
              CommonModule, NzFormModule, FormsModule,
              ReactiveFormsModule, NzButtonModule, NzInputModule,
              NzIconModule, NzDividerModule, NzSelectModule,
              NzRadioModule, NzUploadModule
           ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{

  data = inject(NZ_MODAL_DATA) || undefined;

  form: FormGroup = new FormGroup({});

  fileList: NzUploadFile[] = [];

  categoryList: any[] = [];

  constructor(
                private fb: FormBuilder,
                private message: NzMessageService,
                private modal: NzModalRef,
                private productsService: ProductsService,
              ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.data?.name || null],
      price: [this.data?.price || null],
      info: [this.data?.info || null],
      category: [this.data?.category || null],
      stock: [this.data?.stock || null],
      status: [this.data?.status || true],
    });
    this.getCategory();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  /**
   * 關閉新增/編輯modal
   */
  close() {
    this.modal.destroy();
  }

  /**
   * 取得所有產品類別
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
    ).subscribe();
  }

  /**
   * 新增/編輯產品
   */
  sumbit() {
    const params: any = {
      name: this.form.value.name,
      price: Number(this.form.value.price),
      info: this.form.value.info,
      category: this.form.value.category,
      stock: Number(this.form.value.stock),
      status: this.form.value.status,
    }
    const res = this.data ? this.productsService.editProduct(this.data.id, params) : this.productsService.addProduct(params);
    res.pipe(
      tap((res) => {
        this.message.success(this.data ? '編輯成功' : '新增成功');
        this.modal.close('success');
      }),
      catchError((err) => {
        this.message.error(this.data ? '編輯失敗' : '新增失敗');
        console.error(err);
        return EMPTY;
      })
    ).subscribe();
  }



}
