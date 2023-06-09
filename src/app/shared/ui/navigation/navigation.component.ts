import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
  userData = this.authService.userData;
  isScrollTop: Boolean = false;
  previosScrollPosition: number =
    document.documentElement.scrollTop || document.body.scrollTop;
  selectedLanguage: number = 1;
  constructor(public authService: AuthService, private router: Router) {}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currenScrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    console.log(
      'currenScrollPosition vs previosScrollPosition',
      currenScrollPosition,
      this.previosScrollPosition
    );
    if (currenScrollPosition > 120) {
      this.isScrollTop = currenScrollPosition > this.previosScrollPosition;
    }

    this.previosScrollPosition = currenScrollPosition;
  }
  navigateSignIn() {
    this.router.navigate(['/sign-in']);
  }
  navigateUserInfo() {
    this.router.navigate(['account/user-info']);
  }
  navigateOrderList() {
    this.router.navigate(['account/order-list']);
  }
}
