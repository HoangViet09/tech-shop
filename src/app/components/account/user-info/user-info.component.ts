import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProvincesService } from 'src/app/shared/services/provinces.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  model?: NgbDateStruct;
  userInfo?: any;
  userAuth?: any;
  formUserInfo!: FormGroup;
  provinceCode?: string;
  provinces!: any[];
  districts!: any[];
  wards!: any[];
  public isCollapsed: boolean = false;
  constructor(
    private auth: AuthService,
    private provinceS: ProvincesService,
    private fb: FormBuilder,
    private userS: UserService
  ) {}
  ngOnInit(): void {
    this.provinceS.getDataProvinces().subscribe((res) => {
      this.provinces = res;
    });
    this.formUserInfo = this.fb.group({
      displayName: [''],
      email: [''],
      phoneNumber: [''],
      address: [''],
      province: [''],
      dicstrict: [''],
      ward: [''],
      gender: [''],
    });

    this.fetchUserData();
  }

  fetchUserData() {
    this.auth.userAuth$.subscribe((res) => {
      this.userAuth = res;
      this.userS.getUser(this.userAuth.uid);
    });
    this.userS.userData$.subscribe((res) => {
      this.userInfo = res;
      console.log('fetch user data', this.userInfo);
      this.formUserInfo.patchValue({
        displayName: this.userInfo[0].displayName,
        email: this.userInfo[0].email,
        phoneNumber: this.userInfo[0].phoneNumber,
        address: this.userInfo[0].address,
        // province: this.userInfo[0].province,
        // dicstrict: this.userInfo[0],
        // ward: this.userInfo[0],
        gender: this.userInfo[0].gender,
      });
    });
  }

  startGetDataDictricts(event: any): void {
    console.log(event);
    if (event === undefined) {
      this.formUserInfo.get('dicstrict')?.patchValue('');
      this.formUserInfo.get('ward')?.patchValue('');
      this.districts = [];
      this.wards = [];
      return;
    }
    this.provinceS.getDataDistrict(event.code).subscribe((res) => {
      return (this.districts = res.districts);
      console.log(this.districts);
      // this.formUserInfo.get('dicstrict')?.setValue(res);
    });
  }

  startGetDataWards(event: any): void {
    console.log(event);
    if (event === undefined) {
      this.formUserInfo.get('ward')?.patchValue('');
      this.wards = [];
      return;
    }
    this.provinceS.getDataWard(event.code).subscribe((res) => {
      this.wards = res.wards;
    });
  }

  onSubmitUserInfo(formUserInfo: any): void {
    // console.log(formUserInfo);
    // console.log(this.userInfo.uid);
    this.userS
      .updateProfile(this.userAuth.uid, formUserInfo.value)
      .then((res) => {
        this.fetchUserData();
        Swal.fire({
          icon: 'success',
          title: 'Update infomation successful!',
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
