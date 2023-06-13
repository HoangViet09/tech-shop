import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from 'firebase/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //   userDataSubject: Subject<any> = new BehaviorSubject<any>({}); // Save logged in user data
  //   get userData$(): Observable<any> {
  //     return this.userDataSubject.asObservable();
  //   }
  constructor(
    private db: AngularFireDatabase,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    // this.userData$.subscribe((res) => {
    //   console.log(res);
    // });
  }
  getProducts() {
    return (
      this.afs
        .collection(`/products/`)
        .valueChanges()
        //   .pipe(
        //     tap((res) => {
        //       // console.log(res);
        //       this.userDataSubject.next(res);
        //     })
        //   )
        .subscribe((res) => {
          console.log(res);
        })
    );
  }

  getProduct(productId: string) {
    if (!productId) return;
    return this.afs
      .collection(`/products/`)
      .doc(productId)
      .valueChanges()
      .subscribe((res) => {});
  }

  getProductsByType(type: string) {
    if (!type) return;
    return this.afs
      .collection(`/products/`, (ref) => ref.where('type    ', '==', type))
      .valueChanges()

      .subscribe((res) => {});
  }
}
