import { Component, inject, OnInit } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  productList: any[] = [];

  detailTimeList: any[] = [];

  selectedProducts: any[] = [];

  cardError: string | null = null; // 錯誤訊息

  timeList: any[] = [
    { label: '09:00 - 10:00', value: '9-10' },
    { label: '10:00 - 11:00', value: '10-11' },
    { label: '11:00 - 12:00', value: '11-12' },
    { label: '13:00 - 14:00', value: '13-14' },
    { label: '14:00 - 15:00', value: '14-15' },
    { label: '15:00 - 16:00', value: '15-16' },
    { label: '16:00 - 17:00', value: '16-17' },
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
      detailTime: [null],
      cardPart1: ['', [Validators.pattern('^[0-9]{4}$')]],
      cardPart2: ['', [Validators.pattern('^[0-9]{4}$')]],
      cardPart3: ['', [Validators.pattern('^[0-9]{4}$')]],
      cardPart4: ['', [Validators.pattern('^[0-9]{4}$')]],
      expiryDate: [null],
      cvv: ['', [Validators.pattern('\\d{3}')]],
    });
    this.generateWeekList();
    this.getCategory();

    // 監聽時段選擇的變化
    this.form.get('time')?.valueChanges.subscribe((selectedTime) => {
      const timeSlot = this.timeList.find((time) => time.value === selectedTime);
      if (timeSlot) {
        const [start, end] = timeSlot.label.split('-');
        this.generateDetailTime(start, end);
      }
      else {
        this.detailTimeList = []; // 清空詳細時間列表
      }
    });

    // 監聽類別選擇的變化
    this.form.get('category')?.valueChanges.subscribe((selectedCategoryId) => {
      const selectedCategory = this.productList.find(
        (category) => category.categoryId === selectedCategoryId
      );
      this.selectedProducts = selectedCategory ? selectedCategory.products : [];
    });
  }

  /**
   * 取得產品列表
   */
  getProducts() {
    this.productsService.getProducts().pipe(
      tap((res) => {
        const originalList = res; // 保存原始產品列表
        this.productList = this.categoryList.map((category) => {
          const name = originalList.filter((e: any) =>
            e.category.toString() === category.id).map((e: any) => e.name);
            return {
              categoryId: category.id,
              category: category.name,
              products: name,
            };
        });
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
    })).subscribe(() => {});
  }

  /**
   * 取得類別列表
   */
  getCategory(){
    this.productsService.getCategories().pipe(
      tap((res) => {
        this.categoryList = res;
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
    })).subscribe(() => {
      this.getProducts();
    });
  }

  /**
   * 關閉modal
   */
  close(){
    this.modal.destroy();
  }

  /**
   * 生成星期列表
   */
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

  /**
   * 生成詳細時間列表
   * @param start
   * @param end
   */
  private generateDetailTime(start: string, end: string): void {
    const startTime = this.parseTime(start);
    const endTime = this.parseTime(end);
    const interval = 15; // 15 分鐘間隔
    const times: { label: string; value: string }[] = [];

    let currentTime = startTime;
    while (currentTime < endTime) {
      times.push({
        label: this.formatTime(currentTime), // 單個時間點
        value: this.formatTime(currentTime),
      });
      currentTime = new Date(currentTime.getTime() + interval * 60000); // 加 15 分鐘
    }

    this.detailTimeList = times;
  }

  /**
   * 將時間字串解析為 Date 物件
   */
  private parseTime(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  /**
   * 將 Date 格式化為 HH:mm
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * 自動聚焦到下一個輸入框
   * @param event
   * @param nextField
   */
  autoFocusNext(event: Event, nextField: string): void {
    const input = event.target as HTMLInputElement;

    // 過濾非數字字符並更新表單值
    const sanitizedValue = input.value.replace(/[^0-9]/g, '');
    input.value = sanitizedValue;

    const formControlName = input.getAttribute('formControlName');
    if (formControlName) {
      this.form.get(formControlName)?.setValue(sanitizedValue);
    }

    // 自動聚焦到下一個輸入框
    if (sanitizedValue.length === 4 && nextField) {
      const nextInput = document.querySelector(
        `input[formControlName="${nextField}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }

    // 當最後一個輸入框完成時，驗證卡號
    if (!nextField) {
      const cardParts = [
        this.form.get('cardPart1')?.value,
        this.form.get('cardPart2')?.value,
        this.form.get('cardPart3')?.value,
        this.form.get('cardPart4')?.value,
      ];

      const cardNumber = cardParts.join('');

      if (!this.validateCardNumber(cardNumber)) {
        this.cardError = '無效的信用卡，請重新輸入';
      }
      else {
        this.cardError = null; // 清除錯誤訊息
      }
    }
  }

  /**
 * 驗證信用卡號是否符合規則
 */
  private validateCardNumber(cardNumber: string): boolean {
    if (!/^\d{16}$/.test(cardNumber)) {
      return false; // 必須是 16 位數字
    }

    // 檢查卡號開頭是否符合 VISA、Mastercard、American Express 或 JCB 的規則
    const firstDigit = parseInt(cardNumber[0], 10);
    const firstTwoDigits = parseInt(cardNumber.slice(0, 2), 10);
    const firstThreeDigits = parseInt(cardNumber.slice(0, 3), 10);

    if (!(firstDigit === 4 || // VISA
        (firstDigit === 5 && firstTwoDigits >= 51 && firstTwoDigits <= 55) || // Mastercard
        (firstDigit === 3 && ((firstThreeDigits >= 340 && firstThreeDigits <= 379) || // American Express
         (firstThreeDigits >= 528 && firstThreeDigits <= 589)))) // JCB
        ) {
      return false;
    }

    // 使用 Luhn 演算法驗證卡號
    return this.luhnCheck(cardNumber);
  }

  /**
   * Luhn 演算法檢查卡號
   */
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }



}
