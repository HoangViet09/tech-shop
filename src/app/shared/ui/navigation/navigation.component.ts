import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from '../../services/product.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  tap,
  switchMap,
} from 'rxjs/operators';
import { Observable, of, OperatorFunction } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavigationComponent implements OnInit {
  userData: any;
  isScrollTop: Boolean = false;
  previosScrollPosition: number =
    document.documentElement.scrollTop || document.body.scrollTop;
  selectedLanguage: string = 'vi';
  searching: boolean = false;
  searchFailed: boolean = false;
  totalProduct: number = 0;
  constructor(
    public authService: AuthService,
    private router: Router,
    private productS: ProductService,
    private authS: AuthService,
    private userS: UserService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.authS.userAuth$.subscribe((res) => {
      this.userS.getUser(res.uid);
    });
    this.userS.userData$.subscribe((res) => {
      this.userData = res;
      console.log(this.userData);
      this.getTotalProductQuantity();
    });
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currenScrollPosition =
      document.documentElement.scrollTop || document.body.scrollTop;
    if (currenScrollPosition < 120) return;
    this.isScrollTop = currenScrollPosition > this.previosScrollPosition;
    // console.log(
    //   'currenScrollPosition vs previosScrollPosition',
    //   currenScrollPosition,
    //   this.previosScrollPosition
    // );

    this.previosScrollPosition = currenScrollPosition;
  }
  getTotalProductQuantity() {
    this.totalProduct = 0;
    let productQuantityArr: any[] = [];
    this.userData[0].cart.map((item: any) => {
      return productQuantityArr.push(item.productQuantity);
    });
    productQuantityArr.forEach((item: number) => {
      this.totalProduct += item;
    });
    console.log(this.totalProduct);
  }
  signOut() {
    this.authS.SignOut();
  }
  navigateSignIn() {
    this.router.navigate(['/sign-in']);
  }
  navigateToCart() {
    if (this.authService.isLoggedIn) {
      return this.router.navigate(['/cart']);
    }
    return Swal.fire({
      icon: 'warning',
      title: 'Bạn cần đăng nhập để xem giỏ hàng',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Đăng nhập',
      cancelButtonText: 'Chưa phải lúc',
    }).then((result) => {
      if (result.isConfirmed) return this.navigateSignIn();
    });
  }
  navigateUserInfo() {
    this.router.navigate(['account/user-info']);
  }
  navigateOrderList() {
    this.router.navigate(['account/order-list']);
  }
  onClickProducts(type: string) {
    if (!type) return;
    this.router.navigate(['/products', type]);
  }
  navigateToProduct(event: NgbTypeaheadSelectItemEvent<any>) {
    console.log(event);
    this.router.navigate([
      `/products/${event.item.productType}/${event.item.id}`,
    ]);
  }

  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ): Observable<any[]> =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.productS.search(term).pipe(
          tap(() => (this.searchFailed = false)),
          map((item) =>
            item
              .filter(
                (v) =>
                  v.productName.toLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
          ),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );
  formatter = (x: { name: string }) => x.name;
  onChangeLanguage(event: any) {
    console.log(event);
    this.translate.use(event);
  }
}
