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
import { NzModalRef } from 'ng-zorro-antd/modal';
import { ProductsService } from '../../products/products.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

@Component({
  selector: 'inspections-form',
  imports: [
              CommonModule, NzFormModule, FormsModule,
              ReactiveFormsModule, NzButtonModule, NzInputModule,
              NzIconModule, NzDividerModule, NzSelectModule,
              NzDatePickerModule
           ],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit{

  form: FormGroup = new FormGroup({});

  weekList: any[] = [];

  categoryList: any[] = [];

  timeList: any[] = [
    { label: '09:00-10:00', value: '09:00-10:00' },
    { label: '10:00-11:00', value: '10:00-11:00' },
    { label: '11:00-12:00', value: '11:00-12:00' },
    { label: '13:00-14:00', value: '13:00-14:00' },
    { label: '14:00-15:00', value: '14:00-15:00' },
    { label: '15:00-16:00', value: '15:00-16:00' },
    { label: '16:00-17:00', value: '16:00-17:00' },
  ]

  constructor(
                private fb: FormBuilder,
                private message: NzMessageService,
                private modal: NzModalRef,
                private productsService: ProductsService,
              ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      product: [null],
      category: [null],
      date: [null],
      time: [null],
    });
    this.generateWeekList();
    this.getCategory();
  }

  getProducts() {
    this.productsService.getProducts().pipe(
      tap((res) => {

      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    ).subscribe(() => {});
  }

  getCategory(){
    this.productsService.getCategories().pipe(
      tap((res) => {
        this.categoryList = res;
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
    })).subscribe(() => {});
  }

  close(){
    this.modal.destroy();
  }

  generateWeekList(): void {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const mmdd = `${date.getFullYear()}/${this.pad(date.getMonth() + 1)}/${this.pad(date.getDate())}`;
      const weekday = weekdays[date.getDay()];

      this.weekList.push({
        value: mmdd,
        label: `${mmdd} (${weekday})`
      });
    }
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  onDateChange(selectedDate: string): void {
    // 根據選擇的日期更新時段選項
    if (selectedDate) {
      
    }

    // 清空時段選擇
    this.form.get('time')?.reset();
  }



}
