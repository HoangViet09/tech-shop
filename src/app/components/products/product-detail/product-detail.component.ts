import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';
import { WindowService } from 'src/app/shared/services/window.service';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent implements OnInit {
  @ViewChild('radioColor', { static: false }) radioColor:
    | ElementRef<HTMLInputElement>
    | undefined;
  userId: any;
  productId!: string;
  productType!: string;
  dataProduct!: any;
  dataProductSegment!: any;
  quantityNumber: number = 1;
  configHeaderImg: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    // navigation: true,
    pagination: {
      // el: '.swiper-pagination',
      type: 'progressbar',
    },
    scrollbar: { draggable: true },
  };
  configBestDeal: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    // navigation: true,
    // pagination: {
    //   // el: '.swiper-pagination',
    //   type: 'progressbar',
    // },
    scrollbar: { draggable: true },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productS: ProductService,
    private window: WindowService,
    private authS: AuthService,
    private userS: UserService,
    public translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.productType = params['type'];
      this.fetchData();
    });
    this.window.scrollToTop();
    this.authS.userAuth$.subscribe((res) => {
      this.userId = res.uid;
    });
  }

  fetchData() {
    return this.productS.getProduct(this.productId).subscribe((res: any) => {
      this.dataProduct = res;
      console.log(this.dataProduct);
      this.productS
        .getProductSegment(
          this.productType,
          this.dataProduct.product_header.price
        )
        .subscribe((res) => {
          this.dataProductSegment = res;
          console.log(this.dataProductSegment);
        });
    });
  }
  onSwiper(swiper: any) {
    // console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
  // onCheckedInput(input: HTMLInputElement) {
  //   input.checked = true;
  //   const checkedInput = input.querySelector(':checked');
  //   if (checkedInput) {
  //     const label = checkedInput.nextElementSibling;

  //     console.log(label); // Output the label value of the checked radio input
  //   }
  // }
  getPromotionPrice(price: number) {
    return Math.round((price * 1.15) / 100000) * 100000;
  }
  navigateDetailPage(productId: string) {
    // console.log('run');
    this.router.navigate(['/products', this.productType, productId]);
  }
  inCreaseQuantity() {
    if (this.quantityNumber >= 99) return;
    return (this.quantityNumber = this.quantityNumber + 1);
  }
  deCreaseQuantity() {
    if (this.quantityNumber <= 1) return;

    return (this.quantityNumber = this.quantityNumber - 1);
  }

  addToCart() {
    let colorChoosed: { [key: string]: number } = {};
    const checkedInput: HTMLInputElement | null | undefined =
      this.radioColor?.nativeElement.querySelector(':checked');
    if (checkedInput?.nextElementSibling?.textContent) {
      const objectKey = checkedInput.nextElementSibling.textContent;
      const objectValue = checkedInput.value;
      colorChoosed[objectKey] = Number(objectValue);
      console.log(colorChoosed);
    }
    this.userS.addToCart(
      this.userId,
      this.productId,
      this.quantityNumber,
      colorChoosed,
      this.dataProduct
    );
  }
}
