import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/shared/services/user.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'email',
    'gender',
    'phone',
    'address',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private modalService: NgbModal,
    private userS: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userS.getListUser().subscribe((res) => {
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

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editRow(row: any) {
    const modalRef = this.modalService.open(EditUserComponent);
    modalRef.componentInstance.data = row;
  }
  deleteRow(userData: any) {
    Swal.fire({
      title: 'Are you sure you want to delete this user?',
      icon: 'warning',
      showConfirmButton: true,
      showDenyButton: true,
      denyButtonText: 'Back',
    }).then((user) => {
      if (user.isConfirmed)
        return this.userS.removeUser(userData.uid).then(
          () => {
            Swal.fire({
              title: 'delete product successful!',
              timer: 1000,
              icon: 'success',
            });
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: err,
            });
          }
        );
      return;
    });
    console.log(userData);
  }

  navigateAdminOrders() {
    this.router.navigate(['admin/orders']);
  }
  navigateAdminProducts() {
    this.router.navigate(['admin/products']);
  }
}
