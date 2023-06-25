import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isScrollTopVisible: boolean = false;

  constructor(private router: Router) {}
  title = 'aley-tech-shop';
  ngOnInit() {}
  isSignInRoute(): boolean {
    return this.router.url === '/sign-in';
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
