import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../env/environment';
import { Database } from '../types/supabase';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {

  private supabase?: SupabaseClient;

  constructor() {
    this.createClient();
  }

  /**
   * 建立 Supabase 客戶端
   */
  createClient() {
    if (typeof window === 'undefined' || createClient<Database> === undefined) return;
    this.supabase = createClient<Database>(env.supabaseUrl, env.supabaseKey);
  }

  /**
   * 取得產品列表
   * @param page
   * @param limit
   */
  getProducts(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return this.supabase?.from('products').select('*',
      { count: 'exact' }).order('update', { ascending: false }).order('id').range(from, to);
  }

  /**
   * 新增產品
   * @param data
   */
  addProduct(data: any) {
    return this.supabase?.from('products').insert([data]);
  }

  /**
   * 更新產品
   * @param id
   * @param data
   */
  updateProduct(id: string, data: any) {
    return this.supabase?.from('products').update(data).eq('id', id);
  }

  /**
   * 刪除產品
   * @param id
   */
  deleteProduct(id: string) {
    return this.supabase?.from('products').delete().eq('id', id);
  }

  /**
   * 取得產品類別
   */
  getCategories() {
    return this.supabase?.from('categories').select('*');
  }

  /**
   * 取得所有產品
   */
  getAllProducts(){
    return this.supabase?.from('products').select('*');
  }

  /**
   * 上傳圖片到 Supabase Storage
   * @param file
   */
  async uploadImage(file: any) {
    if (!this.supabase) {
      console.error('Supabase client is not initialized');
      return;
    }
    const ext = file.name.split('.').pop(); // 副檔名
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
    const { data, error } = await this.supabase.storage.from('image').upload(`public/img/${safeName}`, file);
    if (error) {
      console.error('上傳失敗', error);
      return;
    }

    // 建立可公開存取的網址
    const imageUrl = this.supabase?.storage.from('image').getPublicUrl(data.path).data.publicUrl;

    console.log('圖片網址：', imageUrl);
    return imageUrl;
  }

  /**
   * 取得所有訂單
   */
  getOrders(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return this.supabase?.from('orders').select(`*,
      order_items(order_id, name, quantity, pay, shipping)`,
      { count: 'exact' }).order('update', { ascending: false }).order('id').range(from, to);
  }

  /**
   * 編輯訂單
   */
  editOrder(id: string, data: any) {
    return this.supabase?.from('orders').update(data).eq('id', id);
  }

  /**
   * 取得所有檢測
   * @param page
   * @param limit
   */
  getInspections(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    return this.supabase?.from('inspections').select('*', { count: 'exact' }).order('update', { ascending: false }).order('id').range(from, to);
  }

  /**
   * 新增檢測
   * @param data
   */
  addInspection(data: any) {
    return this.supabase?.from('inspections').insert([data]);
  }


  getChartData(){
    return this.supabase?.from('chart').select('*');
  }



}
