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
    'userId',
    'email',
    'userName',
    'phone',
    'payment',
    'orderTime',
    'totalPrice',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private orderS: OrderService, private router: Router) {}

  ngOnInit() {
    this.orderS.getAllOrder().subscribe((res) => {
      this.dataSource = new MatTableDataSource(res);
      console.log(this.dataSource);
      console.log(this.dataSource.filter);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    let filterData = this.dataSource.data.filter((item) => {
      // console.log(
      //   item.orderItem.orderDesc.displayName
      //     .toLowerCase()
      //     .includes(filterValue.trim().toLocaleLowerCase())
      // );
      return item.orderItem.orderDesc.displayName
        .normalize('NFD')
        .toLowerCase()
        .includes(filterValue.trim().normalize('NFD').toLocaleLowerCase());
    });
    console.log(filterData);
    // console.log(filterValue.trim().toLocaleLowerCase());

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  navigateAdminUser() {
    this.router.navigate(['admin/users']);
  }
}
