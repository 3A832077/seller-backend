import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from './pages/auth.service';

@Component({
    selector: 'app-root',
    imports: [
                CommonModule, RouterLink, RouterOutlet,
                NzIconModule, NzLayoutModule, NzMenuModule,
                MatTooltipModule
             ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isCollapsed = false;

  meetUrl = '';

  constructor(
                private router: Router,
                private auth: AuthService,
              ) { }
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

  createMeeting() {
    this.auth.createEvent();
  }

}
