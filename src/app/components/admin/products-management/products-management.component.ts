import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AddProductComponent } from './add-product/add-product.component';

@Component({
  selector: 'app-products-management',
  templateUrl: './products-management.component.html',
  styleUrls: ['./products-management.component.scss'],
})
export class ProductsManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'productID',
    'productName',
    'productBrand',
    'productType',
    'productPrice',
    // 'productImg',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  resData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private modalService: NgbModal,
    private productS: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productS.getProducts().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      console.log(this.dataSource);
      this.resData = res;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === '') {
      this.dataSource = new MatTableDataSource(this.resData);
      this.dataSource.paginator = this.paginator;

      this.dataSource.filter = '';
      return;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();

    let filterData = this.dataSource.data.filter((item) => {
      return (
        this.removeDiacritics(item.product_header.title.toLowerCase()).includes(
          this.removeDiacritics(filterValue.trim().toLocaleLowerCase())
        ) ||
        item.product_header.brand
          .toLocaleLowerCase()
          .includes(filterValue.trim().toLocaleLowerCase()) ||
        item.id
          .toLocaleLowerCase()
          .includes(filterValue.trim().toLocaleLowerCase())
      );
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    return (this.dataSource = new MatTableDataSource(filterData));
  }
  removeDiacritics(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  openAddModal() {
    this.modalService.open(AddProductComponent, {
      size: 'md',
      scrollable: true,
    });
  }
  openEditModal(row: any) {
    const modalRef = this.modalService.open(EditProductComponent, {
      size: 'md',
      scrollable: true,
    });
    modalRef.componentInstance.data = row;
  }
  deleteRow(product: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this product?',
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: 'Back',
    }).then((decided) => {
      if (decided.isConfirmed) return this.productS.deleteProduct(product.id);
      return;
    });
    console.log(product);
  }

  navigateAdminOrder() {
    this.router.navigate(['admin/orders']);
  }
  navigateAdminUser() {
    this.router.navigate(['admin/users']);
  }
}
