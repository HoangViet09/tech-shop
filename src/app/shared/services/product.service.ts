import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { User } from 'firebase/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  CollectionReference,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) {
    // this.userData$.subscribe((res) => {
    //   console.log(res);
    // });
  }
  getProducts() {
    return this.afs.collection(`/products/`).valueChanges();
    //   .pipe(
    //     tap((res) => {
    //       // console.log(res);
    //       this.userDataSubject.next(res);
    //     })
    //   )
  }

  getProduct(productId: string) {
    if (!productId) return;
    return this.afs
      .collection(`/products/`)
      .doc(productId)
      .valueChanges()
      .subscribe((res) => {});
  }

  getProductsByCondition(
    type?: string,
    brands?: string[],
    maxPrice?: number,
    minPrice?: number,
    sort?: string
  ): Observable<any> {
    console.log('run');
    let query = (ref: CollectionReference) => {
      let collection = ref.where('product_type', '==', type);
      console.log(type);
      if (brands && brands.length > 0) {
        collection = collection.where('product_header.brand', 'in', brands);
        console.log(brands);
      }

      if (maxPrice && minPrice) {
        collection = collection
          .where('product_header.price', '>', minPrice)
          .where('product_header.price', '<=', maxPrice);
        console.log('Price range:', minPrice, '-', maxPrice);
      } else if (maxPrice) {
        collection = collection.where('product_header.price', '<=', maxPrice);
        console.log('Max price:', maxPrice);
      } else if (minPrice) {
        collection = collection.where('product_header.price', '>', minPrice);
        console.log('Min price:', minPrice);
      }
      if (sort === 'asc') {
        collection = collection.orderBy('product_header.price', 'asc');
      }
      if (sort === 'desc') {
        collection = collection.orderBy('product_header.price', 'desc');
      }

      return collection;
    };

    return this.afs.collection('/products/', query).valueChanges();
  }
}
