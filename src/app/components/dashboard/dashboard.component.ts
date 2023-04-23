import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  constructor(public authService: AuthService) {}
  ngOnInit(): void {}

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
