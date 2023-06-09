import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent {
  userInfo: any;
  constructor(private auth: AuthService) {
    console.log(auth.userData);
  }
}
