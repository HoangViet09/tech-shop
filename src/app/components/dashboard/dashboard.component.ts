import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { SwiperOptions } from 'swiper';
// import Swiper core and required modules
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/shared/services/product.service';

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  currentRate: number = 5;
  active: string = 'Samsung';
  dataProductToDay: any;
  dataProductBrand: any;

  constructor(
    public authService: AuthService,
    private productS: ProductService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.productS.getRandomProducts(5).subscribe((res) => {
      this.dataProductToDay = res;
      console.log(res);
    });
    this.fetchDataProductBrand(this.active);
  }
  @HostListener('mousemove', ['$event']) onMouseMove(event: MouseEvent) {
    const cursor = this.el.nativeElement.querySelector('#cursor');
    if (cursor) {
      const x = event.pageX - cursor.clientWidth;
      const y = event.pageY - cursor.clientHeight;
      this.renderer.setStyle(cursor, 'top', `${y}px`);
      this.renderer.setStyle(cursor, 'left', `${x}px`);
    }
  }

  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: false,
    pagination: {
      // el: '.swiper-pagination',
      type: 'progressbar',
    },
    scrollbar: { draggable: true },
  };

  fetchDataProductBrand(brand: string) {
    this.active = brand; // Assign the brand to active before making
    this.productS.getProductbyBrand(brand).subscribe((res) => {
      console.log(brand);
      this.dataProductBrand = res;
    });
  }
  onSwiper(swiper: any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
  navigateToPage(page: string) {
    this.router.navigate([`products/${page}`]);
  }
  navigateDetailPage(productType: String, productId: string) {
    this.router.navigate(['/products', productType, productId]);
  }
}
