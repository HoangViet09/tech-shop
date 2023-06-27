import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { OderService } from 'src/app/shared/services/order.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
  userInfo?: any;
  userAuth?: any;
  orderData$!: Observable<any>;
  orderItem!: any[];

  constructor(
    private auth: AuthService,
    private userS: UserService,
    config: NgbAccordionConfig,
    private orderS: OderService
  ) {
    config.closeOthers = true;
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.auth.userAuth$.subscribe((res) => {
      this.userAuth = res;
      this.userS.getUser(this.userAuth.uid);
    });

    this.userS.userData$.subscribe((res) => {
      if (Object.keys(res).length === 0) return;
      this.userInfo = res;
      this.orderS.getOrderByUser(this.userInfo[0].uid).subscribe((res) => {
        this.orderItem = [];
        res.forEach((item) => {
          return this.orderItem.push(item.orderItem.productData);
        });
        console.log(res);
        // console.log(this.orderItem);
        this.orderData$ = of(res);
      });
    });
  }

  getProductColorPrice(
    productColorPrice: { [color: string]: number },
    productQuantity: number
  ) {
    const price: number = Object.values(productColorPrice)[0];
    return price * productQuantity;
  }
}
