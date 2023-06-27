import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-qrcheckout',
  templateUrl: './qrcheckout.component.html',
  styleUrls: ['./qrcheckout.component.scss'],
})
export class QRCheckoutComponent implements OnInit {
  @Input() paymentUserChoose: any;
  ngOnInit(): void {
    console.log(this.paymentUserChoose);
  }
}
