import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-viewed',
  templateUrl: './product-viewed.component.html',
  styleUrls: ['./product-viewed.component.scss'],
})
export class ProductViewedComponent implements OnInit {
  dataProduct$: Observable<any> = of([]);
  currentRate: number = 5;

  constructor(private router: Router) {}
  ngOnInit(): void {
    const jsonProduct = localStorage.getItem('products');
    if (jsonProduct) {
      this.dataProduct$ = of(JSON.parse(jsonProduct));
    }
  }
  navigateDetailPage(productId: string, productType: string) {
    this.router.navigate([`/products/${productType}/${productId}`]);
  }
}
