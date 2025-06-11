import { Injectable } from '@angular/core';
import { env } from '../env/environment';

declare const google: any;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  tokenClient: any;

  accessToken: string = '';

  isExpired: boolean = true;

  refreshInterval: any;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('accessToken');
      const expiresAt = localStorage.getItem('expires_at');

      if (savedToken && expiresAt && Date.now() < parseInt(expiresAt)) {
        this.accessToken = savedToken;
        this.isExpired = false;
        this.startAutoRefresh();
      }
      else {
        this.loadGoogleSdk().then(() => this.setupOneTap());
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
   * 解碼 JWT Token
   * @param token
   * @returns
   */
  private decodeJwtToken(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  /**
   * 設定 Google One Tap 登入
   */
  public setupOneTap() {
    google.accounts.id.initialize({
      client_id: env.googleClientId,
      callback: (response: any) => {
        const payload = this.decodeJwtToken(response.credential);
        this.getAccessToken(payload.email);
      },
      scope: 'openid email profile',
    });

    google.accounts.id.prompt();
  }

  /**
   * 獲取存取權杖
   * @param email
   */
  private getAccessToken(email: string) {
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: env.googleClientId,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      hint: email,
      prompt: '',
      callback: async (resp: any) => {
        if (resp.access_token) {
          this.accessToken = resp.access_token;
          this.isExpired = false;
          localStorage.setItem('accessToken', resp.access_token);
          localStorage.setItem('expires_at', (Date.now() + resp.expires_in * 1000).toString());

          const info = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{
            headers: { Authorization: `Bearer ${resp.access_token}` },}).then((res) => res.json()
          );

          localStorage.setItem('email', info.email);
          localStorage.setItem('name', info.name);
          localStorage.setItem('picture', info.picture);

          this.startAutoRefresh(resp.expires_in);
        }
      },
    });
    this.tokenClient.requestAccessToken();
  }

  /**
   * 啟動自動續約
   * @param expiresIn
   */
  private startAutoRefresh(expiresIn: number = 3600) {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    this.refreshInterval = setInterval(() => {
      const email = localStorage.getItem('email');
      if (email && this.tokenClient) {
        this.tokenClient.requestAccessToken();
      }}, (expiresIn - 60) * 1000); // 提前1分鐘續約
  }

  /**
   * 檢查使用者是否已登入
   * @returns
   */
  public isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const expiresAt = localStorage.getItem('expires_at');
      return !!token && !!expiresAt && Date.now() < parseInt(expiresAt);
    }
    return false;
  }

  /**
   * 登出
   */
  public logout() {
    this.accessToken = '';
    this.isExpired = true;
    clearInterval(this.refreshInterval);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('picture');
    this.setupOneTap();
  }
}
