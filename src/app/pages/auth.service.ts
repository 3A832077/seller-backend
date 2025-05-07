import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, EMPTY, tap } from 'rxjs';
import { env } from '../env/env';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  tokenClient: any;

  accessToken: string = '';

  isExpired: boolean = false;

  constructor(
                 private http: HttpClient
             ) {
                  // 檢查是否有登入過的token&檢查是否過期
                  if (typeof window !== 'undefined') {
                    const savedToken = localStorage.getItem('accessToken');
                    const expiresAt = localStorage.getItem('expires_at');
                    if (savedToken && expiresAt) {
                      this.isExpired = Date.now() >= parseInt(expiresAt);
                      if (!this.isExpired) {
                        this.accessToken = savedToken;
                      }
                    }
                    else {
                      this.loadGoogleSdk().then(() => {
                          this.initGoogleOAuth();
                      });
                    }
                  }
                }

  /**
   * 載入 Google SDK
   * @returns
   */
  private loadGoogleSdk(): Promise<void> {
    return new Promise((resolve) => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) return resolve();

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  /**
   * 初始化 Google OAuth 客戶端
   */
  private initGoogleOAuth() {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: env.googleClientId,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (resp: any) => {
        if (resp.access_token) {
          this.accessToken = resp.access_token;
          localStorage.setItem('accessToken', this.accessToken);
          localStorage.setItem('expires_at', (Date.now() + resp.expires_in * 1000).toString()); // 儲存過期時間
          this.createEvent(); // 登入成功後直接建立事件
        }
      },
    });
  }

  /**
   * 觸發登入畫面
   */
  signIn() {
    if (!this.tokenClient) {
      this.loadGoogleSdk().then(() => {
        this.initGoogleOAuth();
        this.tokenClient.requestAccessToken();
      });
      return;
    }
    this.tokenClient.requestAccessToken();
  }

  /**
   * 建立會議
   * @returns meetLink
   */
  createEvent() {

    const expiresAt = parseInt(localStorage.getItem('expires_at') || '0');
    const isTokenExpired = Date.now() >= expiresAt;
    if (!this.accessToken || isTokenExpired) {
      this.signIn();
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    });

    const event = {
      summary: 'test',
      description: '123',
      start: {
        dateTime: new Date().toISOString(),
        timeZone: 'Asia/Taipei'
      },
      end: {
        dateTime: new Date(new Date().getTime() + 30 * 60000).toISOString(),
        timeZone: 'Asia/Taipei'
      },
      conferenceData: {
        createRequest: {
          requestId: 'meet-' + Math.random()
        }
      }
    };

    let meetLink = '';

    this.http.post(env.googleApiUrl,event,{ headers }).pipe(
      tap((response: any) => {
        meetLink = response.hangoutLink;
        console.log('會議連結:', meetLink);
      }),
      catchError((error) => {
        console.error('錯誤:', error);
        return EMPTY;
      },)).subscribe(() => {}
    )
    return meetLink;
  }

  public isLoggedIn(): boolean {
    let savedToken = null;
    let expiresAt = null;
    if (typeof window !== 'undefined') {
      savedToken = localStorage.getItem('accessToken');
      expiresAt = localStorage.getItem('expires_at');
    }
    return !!savedToken && !!expiresAt && Date.now() < parseInt(expiresAt);
  }

  public logout() {
    this.accessToken = '';
    this.isExpired = true;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    console.log('使用者已登出');
  }


}
