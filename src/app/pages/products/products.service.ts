import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { env } from '../../env/environment';
import { SupabaseService } from '../../service/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  constructor(private supabase: SupabaseService) {}

  // async getProducts(page: number, limit: number) {
  //   const from = (page - 1) * limit;
  //   const to = from + limit - 1;
  //   const { data, error } = await this.supabase.client.from('products').select('*', { count: 'exact' }).range(from, to);
  // }

  // addProduct(data: any) {
  //   return this.supabase.client.from('products').insert([data]);
  // }

  // updateProduct(id: string, data: any) {
  //   return this.supabase.client.from('products').update(data).eq('id', id);
  // }

  // deleteProduct(id: string) {
  //   return this.supabase.client.from('products').delete().eq('id', id);
  // }

  // getCategories(): Observable<any> {
  //   return from(this.supabase.client.from('categories').select('*'));
  // }

  // getProducts2(){
  //   return this.supabase.client.from('products').select('*');
  // }

}
