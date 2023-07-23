import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { OrderService } from 'src/app/shared/services/order.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DateFormatPipe } from 'src/app/shared/pipe/dateFormat.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders-management',
  templateUrl: './orders-management.component.html',
  styleUrls: ['./orders-management.component.scss'],
  providers: [DateFormatPipe],
})
export class OrdersManagementComponent {
  displayedColumns: string[] = [
    'orderId',
    'userId',
    'email',
    'userName',
    'phone',
    'payment',
    'orderTime',
    'state',
    'totalPrice',
  ];
  dataSource!: MatTableDataSource<any>;
  resData: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderS: OrderService, private router: Router) {}

  ngOnInit() {
    this.orderS.getAllOrder().subscribe((res) => {
      this.resData = res;

      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue === '') {
      this.dataSource = new MatTableDataSource(this.resData);
      this.dataSource.filter = '';
      return;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();

    let filterData = this.dataSource.data.filter((item) => {
      return (
        this.removeDiacritics(
          item.orderItem.orderDesc.displayName.toLowerCase()
        ).includes(
          this.removeDiacritics(filterValue.trim().toLocaleLowerCase())
        ) ||
        item.orderItem.userId
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

  changeOrderState(orderId: string) {
    // console.log(orderId);
    this.orderS.changeStateOrder(orderId);
  }
  removeDiacritics(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  navigateAdminUsers() {
    this.router.navigate(['admin/users']);
  }
  navigateAdminProducts() {
    this.router.navigate(['admin/products']);
  }
}
