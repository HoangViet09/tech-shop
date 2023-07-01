import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent {
  @Input() data: any;
  message!: string;
  modalRef!: NgbModalRef;

  imageSrc!: string;
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private userS: UserService
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      displayName: ['', Validators.compose([Validators.required])],
      phoneNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ]),
      ],
      address: ['', Validators.compose([Validators.required])],
    });
    console.log(this.data);
    this.fetchUserData();
  }
  closeModal() {
    this.activeModal.close();
  }

  fetchUserData() {
    this.form.patchValue({
      email: this.data.email,
      name: this.data.displayName,
      phoneNumber: this.data.phoneNumber,
      address: this.data.address,
    });
  }

  onSubmit(form: any) {
    this.form.markAllAsTouched();
    if (form.valid == false)
      return Swal.fire({
        title: 'Có lỗi trong quá trình nhập liệu',
        icon: 'error',
        timer: 700,
      });
    return this.userS.updateProfile(this.data.uid, form.value).then(() => {
      Swal.fire({
        title: 'Cập nhật user thành công',
        icon: 'success',
        timer: 1000,
      });
    });
  }
}
