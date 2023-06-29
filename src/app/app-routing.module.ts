import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './components/authentication/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/authentication/verify-email/verify-email.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import { UserInfoComponent } from './components/account/user-info/user-info.component';
import { OrderListComponent } from './components/account/order-list/order-list.component';
import { ProductsPageComponent } from './components/products/products-page/products-page/products-page.component';
import { ProductDetailComponent } from './components/products/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart/cart.component';
import { ProductViewedComponent } from './components/product-viewed/product-viewed/product-viewed.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { ProductsManagementComponent } from './components/admin/products-management/products-management.component';
import { OrdersManagementComponent } from './components/admin/orders-management/orders-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  //auth-pages
  { path: 'sign-in', component: SignInComponent },
  { path: 'register-user', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },

  //account-pages
  { path: 'account/user-info', component: UserInfoComponent },
  { path: 'account/order-list', component: OrderListComponent },
  { path: 'cart', component: CartComponent },

  //product-pages
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'products', component: ProductsPageComponent },
  { path: 'products/:type', component: ProductsPageComponent },
  { path: 'products/:type/:id', component: ProductDetailComponent },
  { path: 'products-viewed', component: ProductViewedComponent },

  //admin pages
  { path: 'admin/users', component: UserManagementComponent },
  { path: 'admin/products', component: ProductsManagementComponent },
  { path: 'admin/orders', component: OrdersManagementComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
