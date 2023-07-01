import {
  Component,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProvincesService } from 'src/app/shared/services/provinces.service';
import { UserService } from 'src/app/shared/services/user.service';
import { QRCheckoutComponent } from './qrcheckout/qrcheckout.component';
import { OrderService } from 'src/app/shared/services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CartComponent {
  model?: NgbDateStruct;
  userInfo?: any;
  userAuth?: any;
  dataCart$!: Observable<any>;
  formUserInfo!: FormGroup;
  provinceCode?: string;
  provinces!: any[];
  defaultProvinces: any = {};
  districts!: any[];
  defaultDicstrict: any = {};
  wards!: any[];
  defaultWard: any = {};
  radioSelectedValue: string = '';
  colorPriceValues: Array<any> = [];
  quantityNumber!: number;
  totalAmount: number = 0;
  constructor(
    private auth: AuthService,
    private provinceS: ProvincesService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private userS: UserService,
    private oderS: OrderService
  ) {}
  ngOnInit(): void {
    this.provinceS.getDataProvinces().subscribe((res) => {
      this.provinces = res;
    });
    this.formUserInfo = this.fb.group({
      displayName: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      province: [''],
      dicstrict: [''],
      ward: [''],
      gender: [''],
      notes: [''],
    });

    this.fetchUserData();
  }

  fetchUserData() {
    this.auth.userAuth$.subscribe((res) => {
      this.userAuth = res;
      this.userS.getUser(this.userAuth.uid);
    });
    this.userS.userData$.subscribe((res) => {
      if (Object.keys(res).length === 0) return;
      this.userInfo = res;
      this.fetchCartData();
      this.getTotalAmount(this.userInfo[0].cart);

      this.defaultProvinces.code = this.userInfo[0].province;
      this.defaultDicstrict.code = this.userInfo[0].dicstrict;
      this.defaultWard.code = this.userInfo[0].ward;
      this.startGetDataDictricts(this.defaultProvinces);
      this.startGetDataWards(this.defaultDicstrict);
      console.log('fetch user data', this.userInfo);
      this.getColorPrice(this.userInfo[0].cart);

      this.formUserInfo.patchValue({
        displayName: this.userInfo[0].displayName,
        email: this.userInfo[0].email,
        phoneNumber: this.userInfo[0].phoneNumber,
        address: this.userInfo[0].address,
        province: this.defaultProvinces.code,
        dicstrict: this.defaultDicstrict.code,
        ward: this.defaultWard.code,
        gender: this.userInfo[0].gender,
      });
    });
  }

  fetchCartData() {
    this.dataCart$ = of(this.userInfo[0].cart);
  }

  startGetDataDictricts(event: any): void {
    // console.log(event);
    if (event === undefined) {
      this.formUserInfo.get('dicstrict')?.patchValue('');
      this.formUserInfo.get('ward')?.patchValue('');
      this.districts = [];
      this.wards = [];
      return;
    }
    this.provinceS.getDataDistrict(event.code).subscribe((res) => {
      return (this.districts = res.districts);
      console.log(this.districts);
      // this.formUserInfo.get('dicstrict')?.setValue(res);
    });
  }

  startGetDataWards(event: any): void {
    // console.log(event);
    if (event === undefined) {
      this.formUserInfo.get('ward')?.patchValue('');
      this.wards = [];
      return;
    }
    this.provinceS.getDataWard(event.code).subscribe((res) => {
      this.wards = res.wards;
    });
  }

  onCheckRadio(radioValue: string) {
    console.log(radioValue);
    this.radioSelectedValue = radioValue;
  }

  getColorPrice(cartItem: Array<any>) {
    console.log('run', cartItem);

    this.colorPriceValues = cartItem.map(
      (item) => Object.values(item.colorProduct)[0]
    );

    // console.log(this.colorPriceValues);
  }

  getProductColorPrice(
    productColorPrice: { [color: string]: number },
    productQuantity: number
  ) {
    const price: number = Object.values(productColorPrice)[0];
    return price * productQuantity;
  }

  getProductColorPromotion(
    productColorPrice: { [color: string]: number },
    productQuantity: number
  ) {
    const truePrice = Object.values(productColorPrice)[0] * productQuantity;
    // console.log(Object.values(productColorPrice)[0], productQuantity);
    return Math.round((truePrice * 1.15) / 100000) * 100000;
  }

  onUpdateCart(
    event: { color_label: string; color_price: number },
    cartItem: any
  ) {
    const colorObject = { [event.color_label]: event.color_price };
    this.userS.updateCart(cartItem, this.userAuth.uid, colorObject);
  }

  onRemoveCartItem(event: Event) {
    console.log(event);
    this.userS.removeCartItem(event, this.userAuth.uid);
  }

  increaseQuantityNumber(quantityNumber: number, cartItem: any) {
    if (quantityNumber >= 99) return;
    this.quantityNumber = quantityNumber + 1;
    this.userS.updateCart(
      cartItem,
      this.userAuth.uid,
      undefined,
      this.quantityNumber
    );
  }
  decreaseQuantityNumber(quantityNumber: number, cartItem: any) {
    if (quantityNumber <= 1) return;
    this.quantityNumber = quantityNumber - 1;
    console.log('number', this.quantityNumber);
    this.userS.updateCart(
      cartItem,
      this.userAuth.uid,
      undefined,
      this.quantityNumber
    );
  }

  getTotalAmount(arrCart: any[]) {
    let arrAmount: any[] = arrCart.map((item) => {
      return Object.values<number>(item.colorProduct)[0] * item.productQuantity;
    });
    arrAmount.forEach((item: number) => {
      this.totalAmount += item;
    });
    return this.totalAmount;
  }

  onCheckout() {
    if (this.radioSelectedValue === '') {
      Swal.fire({
        icon: 'error',
        title: 'Xin mời chọn hình thức thanh toán',
      });
      return;
    }
    const orderTime = this.vnPayDateFormat(new Date());
    console.log(
      this.formUserInfo.value,
      this.totalAmount,
      orderTime,
      this.userAuth.uid
    );
    this.oderS
      .addOrder(
        this.userAuth.uid,
        orderTime,
        this.radioSelectedValue,
        this.userInfo[0].cart,
        this.formUserInfo.value,
        this.totalAmount
      )
      .then(() => {
        this.openModal();
        this.userS.removeCart(this.userAuth.uid);
      });
  }

  to2DigitNumber(number: number) {
    if (isNaN(number)) {
      throw new Error('to2DigitNumber:param must be a number');
    }
    if (!number) {
      return '00';
    }

    return `0${number}`.substr(-2, 2);
  }
  vnPayDateFormat(date: any) {
    if (date.constructor.name !== 'Date') {
      throw new Error('vnPayDateFormat:param must be a date');
    }

    let result = '';
    result += date.getFullYear().toString();
    result += this.to2DigitNumber(date.getMonth() + 1);
    result += this.to2DigitNumber(date.getDate());
    result += this.to2DigitNumber(date.getHours());
    result += this.to2DigitNumber(date.getMinutes());
    result += this.to2DigitNumber(date.getSeconds());

    return result;
  }

  openModal() {
    console.log('run');
    const modalRef = this.modalService.open(QRCheckoutComponent, {
      size: 'sm',
    });
    //
    modalRef.componentInstance.paymentUserChoose = this.radioSelectedValue;
  }
}
