import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbDropdownModule,
  NgbRatingModule,
  NgbNavModule,
  NgbDatepickerModule,
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
  ],
})
export class UiModule {}
