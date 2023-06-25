import { Component, OnInit, Renderer2 } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';
interface CheckboxChangeEvent {
  target: HTMLInputElement;
}
@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
})
export class ProductsPageComponent implements OnInit {
  currentRate: number = 5;
  selectedSortOption: number = 1;
  type!: string;
  arrOfBrand: Array<string> = [];
  maxPrice!: number;
  minPrice!: number;
  sort!: string;
  dataProduct$!: Observable<any>;
  brand$!: Observable<any[]>;

  constructor(
    private productS: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
      if (!this.type) return;
      this.fetchDataProduct(this.type);
    });
  }
  //function get data
  fetchDataProduct(
    type?: string,
    brands?: Array<string>,
    maxPrice?: number,
    minPrice?: number,
    getbrands: boolean = true,
    sort?: string
  ) {
    this.productS
      .getProductsByCondition(type, brands, maxPrice, minPrice, sort)
      .subscribe((res) => {
        //condition get the unique brand start
        if (getbrands) {
          const tempArr: any[] = [];
          res.map((item: any) => tempArr.push(item.product_header.brand));
          this.brand$ = of(
            tempArr.filter((item, index) => {
              if (
                item === 'Redmi 12C (4GB/64GB) - Chính hãng' ||
                item ===
                  'Camera IP Wi-Fi TP-Link Tapo C210 360° 3MP - Chính hãng' ||
                item === 'Máy tính bảng Lenovo Tab P11 Plus - Chính hãng' ||
                item === 'Phân loại sản phẩm'
              ) {
                return false;
              }

              return tempArr.indexOf(item) === index;
            })
          );
          this.brand$.subscribe((res: any) => {
            console.log(res);
          });
        }
        //condition get the unique brand end

        console.log(res);
        return (this.dataProduct$ = of(res));
      });
  }
  //function hover effect
  changeImage(item: any, index: number): void {
    item.currentImageIndex = index;
  }

  //when checkbox trigger run this function
  onCheckboxChange(event: Event, checkbox: HTMLInputElement): void {
    //declare type of target for code suggestions
    const target = event.target as HTMLInputElement;

    //condition if user checked
    if (target.checked) {
      this.arrOfBrand.push(checkbox.value);
      // console.log(checkbox.value); // Print the value to the console
      // console.log(this.arrOfBrand); // Print the value to the console
      return this.fetchDataProduct(
        this.type,
        this.arrOfBrand,
        this.maxPrice,
        this.minPrice,
        false
      );
    }
    //else find index of item similar with value passed to function and delete
    this.arrOfBrand.splice(
      this.arrOfBrand.findIndex((item) => {
        item === checkbox.value;
      }),
      1
    );
    // console.log(this.arrOfBrand);
    return this.fetchDataProduct(
      this.type,
      this.arrOfBrand,
      this.maxPrice,
      this.minPrice,
      false
    );
  }
  //get min value input
  onMaxPriceInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.maxPrice = Number(target.value);
  }
  //get max value input
  onMinPriceInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.minPrice = Number(target.value);
  }

  filterByFrice(): void {
    // console.log(this.maxPrice);
    // console.log(this.minPrice);
    // console.log(this.type);
    // console.log(this.arrOfBrand);
    // if (!this.maxPrice && !this.minPrice) return;
    // if (this.maxPrice < this.minPrice || this.minPrice > this.maxPrice) return;

    return this.fetchDataProduct(
      this.type,
      this.arrOfBrand,
      this.maxPrice,
      this.minPrice
    );
  }

  clearPriceInput(lowInput: any, hightInput: any) {
    // console.log(lowInput);
    this.maxPrice = 0;
    this.minPrice = 0;
    lowInput.value = '';
    hightInput.value = '';
    this.fetchDataProduct(
      this.type,
      this.arrOfBrand,
      this.maxPrice,
      this.minPrice
    );
  }

  // funtion get data Based on the SELECT value
  onChangeSortValue() {
    switch (this.selectedSortOption) {
      case 1:
        this.fetchDataProduct(
          this.type,
          this.arrOfBrand,
          this.maxPrice,
          this.minPrice,
          false
        );
        break;
      case 2:
        this.fetchDataProduct(
          this.type,
          this.arrOfBrand,
          this.maxPrice,
          this.minPrice,
          false,
          'asc'
        );
        break;
      case 3:
        this.fetchDataProduct(
          this.type,
          this.arrOfBrand,
          this.maxPrice,
          this.minPrice,
          false,
          'desc'
        );
        break;
    }
  }

  navigateDetailPage(productId: string) {
    this.router.navigate(['/products', this.type, productId]);
  }
}
