import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'products', loadChildren: () => import('./pages/products/products.routes').then(m => m.ProductRoutes) },
  { path: 'orders', loadChildren: () => import('./pages/orders/orders.routes').then(m => m.OrdersRoutes) },
];
