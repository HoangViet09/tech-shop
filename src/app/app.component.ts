import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isScrollTopVisible: boolean = false;
  notMainPageUrl: string[] = [
    '/sign-in',
    '/register-user',
    '/forgot-password',
    '/verify-email-address',
    '/admin/users',
    '/admin/products',
    '/admin/orders',
  ];
  constructor(private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('vi');
  }
  title = 'aley-tech-shop';
  ngOnInit() {}
  isNotMainPage(): boolean {
    const isNotMainPage = this.notMainPageUrl.some((item) => {
      return item === this.router.url;
    });
    console.log(isNotMainPage);
    return isNotMainPage;
  }
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currenScrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (currenScrollPosition < 800) return (this.isScrollTopVisible = false);
    // console.log(
    //   'currenScrollPosition vs previosScrollPosition',
    //   currenScrollPosition
    // );
    // console.log(this.isScrollTopVisible);
    return (this.isScrollTopVisible = true);
  }
}
