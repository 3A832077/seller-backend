import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './service/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-root',
    imports: [
                CommonModule, RouterLink, RouterOutlet,
                NzIconModule, NzLayoutModule, NzMenuModule,
                MatTooltipModule, NzButtonModule, NzAvatarModule,
                MatCardModule
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

  constructor(
                private router: Router,
                public auth: AuthService,
              ) {
                  if (typeof window !== 'undefined') {
                    this.userEmail = localStorage.getItem('email') || '';
                    this.userName = localStorage.getItem('name') || '';
                    this.picUrl = localStorage.getItem('picture') || '';
                  }
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


  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
