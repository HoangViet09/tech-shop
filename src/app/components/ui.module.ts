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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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

import { EditUserComponent } from './admin/user-management/edit-user/edit-user.component';
import { AddProductComponent } from './admin/products-management/add-product/add-product.component';
import { EditProductComponent } from './admin/products-management/edit-product/edit-product.component';
import { DateFormatPipe } from '../shared/pipe/dateFormat.pipe';

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
    EditUserComponent,
    AddProductComponent,
    EditProductComponent,
    DateFormatPipe,
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
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UiModule {}
