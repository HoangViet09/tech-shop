import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent {
  form!: FormGroup;
  selectedItem: string = 'Tất cả';

  onSearch() {}
  updateSelected(item: string) {
    this.selectedItem = item;
  }
}
