import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { MatCardModule } from '@angular/material/card';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { LoginComponent } from './pages/login/login.component';
import { SupabaseService } from './service/supabase.service';

@Component({
    selector: 'app-root',
    imports: [
                CommonModule, RouterLink, RouterOutlet,
                NzIconModule, NzLayoutModule, NzMenuModule,
                MatTooltipModule, NzButtonModule, NzAvatarModule,
                MatCardModule, NzModalModule
             ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isCollapsed = false;

  userName: string = '';

  picUrl: string = '';

  userEmail: string = '';

  isDropdownOpen = false;

  userId: string | null = null;

  email: string | null = null;

  constructor(
                private router: Router,
                private modalService: NzModalService,
                private supabaseService: SupabaseService
              ) {
                this.supabaseService.userId$.subscribe(userId => {
                  this.userId = userId;
                });
                this.supabaseService.email$.subscribe(email => {
                  this.email = email;
                });
              }
  ngOnInit() {
  }

  /**
  * 僅當前路徑完全相等時返回 true
  * @param url
  * @returns
  */
  isActive(url: string): boolean {
    return this.router.url === url;
  }

  /**
   * 側邊欄狀態
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * 開啟登入模態框
   */
  openModal() {
    this.modalService.create({
      nzContent: LoginComponent,
      nzFooter: null,
      nzClosable: true,
      nzWidth: '400px',
      nzCentered: true,
      nzMaskClosable: true
    });
  }

  /**
   * 登出
   */
  logout() {
     this.supabaseService?.logout()?.then(() => {
      this.userId = null;
      this.email = null;
      window.location.href = '/dashboard';
    });
  }

}
