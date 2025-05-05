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

@Component({
  selector: 'app-inspections',
  imports: [
              CommonModule, NzTableModule, NzButtonModule,
              NzModalModule, NzDividerModule, NzFormModule,
              NzInputModule, FormsModule, ReactiveFormsModule,
              NzIconModule, RouterOutlet, RouterLink
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

  getInspections() {
    this.loading = true;
    this.inspectionsService.getInspections().pipe(
      tap((res) => {
        this.displayedList = res;
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    ).subscribe(() => {
      this.loading = false;
    });
  }

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
  }





}
