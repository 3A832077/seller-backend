import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../env/environment';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenClient: any;

  accessToken: string = '';

  isExpired: boolean = false;

  constructor(private http: HttpClient) {
    // 檢查是否有登入過的token&檢查是否過期
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('accessToken');
      const expiresAt = localStorage.getItem('expires_at');
      if (savedToken && expiresAt) {
        this.isExpired = Date.now() >= parseInt(expiresAt);
        if (!this.isExpired) {
          this.accessToken = savedToken;
        }
      } else {
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
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
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
          localStorage.setItem(
            'expires_at',
            (Date.now() + resp.expires_in * 1000).toString()
          ); // 儲存過期時間
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
   * 檢查是否登入
   * @returns
   */
  public isLoggedIn(): boolean {
    let savedToken = null;
    let expiresAt = null;
    if (typeof window !== 'undefined') {
      savedToken = localStorage.getItem('accessToken');
      expiresAt = localStorage.getItem('expires_at');
    }
    return !!savedToken && !!expiresAt && Date.now() < parseInt(expiresAt);
  }

  /**
   * 登出
   * @returns
   */
  public logout() {
    this.accessToken = '';
    this.isExpired = true;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    console.log('使用者已登出');
  }
}
