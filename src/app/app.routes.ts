import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.dashboardRoutes) },
  { path: 'products', loadChildren: () => import('./pages/products/products.routes').then(m => m.ProductRoutes) },
  { path: 'orders', loadChildren: () => import('./pages/orders/orders.routes').then(m => m.OrdersRoutes) },
  { path: 'inspections', loadChildren: () => import('./pages/inspections/inspections.routes').then(m => m.inspectionsRoutes) },
  { path: 'login', loadChildren: () => import('./pages/login/login.routes').then(m => m.loginRoutes) },
];
