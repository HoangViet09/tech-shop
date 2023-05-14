import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  constructor(public authService: AuthService, private router: Router) {}
  navigateSignIn(): void {
    this.router.navigateByUrl('/sign-in');
  }
  ngOnInit() {}
}
