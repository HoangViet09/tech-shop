import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit {
  navigateRegister() {
    this.route.navigateByUrl('/register-user');
  }
  navigateForGotFsw() {
    this.route.navigateByUrl('/forgot-password');
  }
  selectedLanguage: number = 1;
  constructor(public authService: AuthService, private route: Router) {}
  ngOnInit() {}
}
