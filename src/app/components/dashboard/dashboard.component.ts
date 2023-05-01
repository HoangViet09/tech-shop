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

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  currentRate = 5;
  constructor(
    public authService: AuthService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {}
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
  onSwiper(swiper: any) {
    console.log(swiper);
  }
  onSlideChange() {
    console.log('slide change');
  }
}
