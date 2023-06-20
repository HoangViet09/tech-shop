import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductDetailComponent implements OnInit {
  productId!: string;
  productType!: string;
  dataProduct!: any;
  dataProductSegment!: any;
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
    private productS: ProductService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = params['id'];
      this.productType = params['type'];
      console.log(this.productId);
      this.fetchData();
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
  onCheckedInput(input: HTMLInputElement) {
    input.checked = !input.checked;
  }
  getPromotionPrice(price: number) {
    return Math.round((price * 1.15) / 100000) * 100000;
  }
  navigateDetailPage(productId: string) {
    console.log('run');
    this.router.navigate(['/products', this.productType, productId]);
  }
}
