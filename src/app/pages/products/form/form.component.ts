import { Component, OnInit } from '@angular/core';
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
import { NzModalRef } from 'ng-zorro-antd/modal';
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

  form: FormGroup = new FormGroup({});

  fileList: NzUploadFile[] = [];

  categoryList: any[] = [];

  constructor(
                private fb: FormBuilder,
                private message: NzMessageService,
                private modal: NzModalRef,
                private productsService: ProductsService
              ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [null],
      price: [null],
      info: [null],
      category: [null],
      stock: [null],
      status: [null],
      picture: [null],
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
}
