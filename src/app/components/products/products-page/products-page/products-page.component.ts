import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProductService } from 'src/app/shared/services/product.service';

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
  dataProduct$!: Observable<any>;
  brand$!: Observable<any[]>;
  constructor(
    private productS: ProductService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.type = params['type'];
      if (!this.type) return;
      this.productS.getProductsByType(this.type).subscribe((res) => {
        // get the unique brand start
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
        // get the unique brand end
        console.log(res);
        this.dataProduct$ = of(res);
      });
    });
  }
  changeImage(item: any, index: number) {
    item.currentImageIndex = index;
  }

  onCheckboxChange(checkbox: HTMLInputElement) {
    if (!checkbox.checked) return;
    if (
      this.arrOfBrand.findIndex((item) => {
        item === checkbox.value;
      }) !== -1
    ) {
      this.arrOfBrand.splice(this.arrOfBrand.indexOf(checkbox.value));
      console.log(this.arrOfBrand);
      console.log(
        this.arrOfBrand.findIndex((item) => {
          item === checkbox.value;
        })
      );
      return;
    }

    const checkboxValue = checkbox.value;
    this.arrOfBrand.push(checkboxValue);
    console.log(checkboxValue); // Print the value to the console
    console.log(this.arrOfBrand); // Print the value to the console
    return;
  }
}
