import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserInfoComponent implements OnInit {
  model?: NgbDateStruct;
  userInfo?: any;
  userAuth?: any;
  formUserInfo!: FormGroup;
  provinceCode?: string;
  provinces!: any[];
  defaultProvinces: any = {};
  districts!: any[];
  defaultDicstrict: any = {};
  wards!: any[];
  defaultWard: any = {};
  public isCollapsed: boolean = false;
  constructor(
    private fb: FormBuilder,
    private provinceS: ProvincesService,
    private auth: AuthService,
    private userS: UserService,
    public translate: TranslateService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.provinceS.getDataProvinces().subscribe((res) => {
      this.provinces = res;
    });
    this.formUserInfo = this.fb.group({
      displayName: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required])],
      phoneNumber: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      province: ['', Validators.compose([Validators.required])],
      dicstrict: ['', Validators.compose([Validators.required])],
      ward: ['', Validators.compose([Validators.required])],
      gender: ['', Validators.compose([Validators.required])],
    });

    this.fetchUserData();
  }

  fetchUserData() {
    this.auth.userAuth$.subscribe((res) => {
      this.userAuth = res;
      this.userS.getUser(this.userAuth.uid);
    });
    this.userS.userData$.subscribe((res) => {
      if (Object.keys(res).length === 0) return;
      this.userInfo = res;
      if (this.userInfo[0].ward) {
        this.defaultProvinces.code = this.userInfo[0].province;
        this.defaultDicstrict.code = this.userInfo[0].dicstrict;
        this.defaultWard.code = this.userInfo[0].ward;
        console.log(this.defaultDicstrict, this.defaultProvinces);
        this.startGetDataDictricts(this.defaultProvinces);
        this.startGetDataWards(this.defaultDicstrict);
        this.formUserInfo.patchValue({
          province: this.defaultProvinces.code,
          dicstrict: this.defaultDicstrict.code,
          ward: this.defaultWard.code,
        });
      }

      console.log('fetch user data', this.userInfo);
      this.formUserInfo.patchValue({
        displayName: this.userInfo[0].displayName,
        email: this.userInfo[0].email,
        phoneNumber: this.userInfo[0].phoneNumber,
        address: this.userInfo[0].address,

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

  onSubmitUserInfo(formUserInfo: any): Promise<any> {
    // console.log(formUserInfo);
    // console.log(this.userInfo.uid);
    this.formUserInfo.markAllAsTouched();
    if (formUserInfo.valid == false) {
      return Swal.fire({
        title: 'Có lỗi trong quá trình nhập liệu',
        icon: 'error',
        timer: 700,
      });
    }
    return this.userS
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
  navigateToUserInfo() {
    this.router.navigate(['/account/user-info']);
  }
  navigateToOrderList() {
    this.router.navigate(['/account/order-list']);
  }
  signOut() {
    this.auth.SignOut();
    this.router.navigate(['/dashboard']);
  }
}
