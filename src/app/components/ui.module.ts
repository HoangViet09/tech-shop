import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdownModule,
  NgbRatingModule,
  NgbNavModule,
  NgbDatepickerModule,
  NgbAccordionModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { SwiperModule } from 'swiper/angular';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SignInComponent } from './authentication/sign-in/sign-in.component';
import { SignUpComponent } from './authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './authentication/verify-email/verify-email.component';
import { UserInfoComponent } from './account/user-info/user-info.component';
import { OrderListComponent } from './account/order-list/order-list.component';
import { ProductsPageComponent } from './products/products-page/products-page/products-page.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { CartComponent } from './cart/cart/cart.component';
import { QRCheckoutComponent } from './cart/cart/qrcheckout/qrcheckout.component';
import { ProductViewedComponent } from './product-viewed/product-viewed/product-viewed.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { ProductsManagementComponent } from './admin/products-management/products-management.component';
import { OrdersManagementComponent } from './admin/orders-management/orders-management.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    UserInfoComponent,
    OrderListComponent,
    ProductsPageComponent,
    ProductDetailComponent,
    CartComponent,
    QRCheckoutComponent,
    ProductViewedComponent,
    UserManagementComponent,
    ProductsManagementComponent,
    OrdersManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    NgbRatingModule,
    NgbDropdownModule,
    NgbNavModule,
    NgSelectModule,
    NgbCollapseModule,
    NgbDatepickerModule,
    NgbAccordionModule,
  ],
})
export class UiModule {}
