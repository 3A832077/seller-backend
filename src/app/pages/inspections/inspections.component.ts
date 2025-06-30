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
import { InspectionsService } from './inspections.service';
import { FormComponent } from './form/form.component';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-inspections',
  imports: [
              CommonModule, NzTableModule, NzButtonModule,
              NzModalModule, NzDividerModule, NzFormModule,
              NzInputModule, FormsModule, ReactiveFormsModule,
              NzIconModule
           ],
  templateUrl: './inspections.component.html',
  styleUrl: './inspections.component.css'
})
export class InspectionsComponent implements OnInit {

  displayedList: any[] = [];

  total: number = 0;

  pageIndex: number = 1;

  pageSize: number = 10;

  loading: boolean = false;

  meetUrl: string = '';

  constructor(
                private modalService: NzModalService,
                private inspectionsService: InspectionsService,
              ) { }

  ngOnInit(): void {
    this.getInspections();
  }

  /**
   * 取得檢測列表
   * @param pageIndex
   * @param pageSize
   */
  getInspections(pageIndex: number = 1, pageSize: number = 10) {
    const params = {
      _page: pageIndex,
      _limit: pageSize
    };
    this.loading = true;
    this.inspectionsService.getInspections(params).pipe(
      tap((res: HttpResponse<any>) => {
        this.displayedList = res.body;
        this.total = Number(res.headers.get('X-Total-Count'));
      }),
      catchError((err) => {
        this.total = 0;
        this.displayedList = [];
        return EMPTY;
      })
    ).subscribe(() => {
      this.loading = false;
    });
  }

  /**
   * 開啟新增/編輯modal
   * @param data
   */
  openModal(){
    const modal = this.modalService.create({
      nzTitle: '新增',
      nzContent: FormComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzCentered: true,
      nzFooter: null,
      nzZIndex: 60,
    });
    modal.afterClose.subscribe((res) => {
      if (res === 'success') {
        this.getInspections();
      }
    });
  }





}
