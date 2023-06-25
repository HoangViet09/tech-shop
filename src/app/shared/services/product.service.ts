import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  CollectionReference,
  DocumentChangeAction,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private db: AngularFireDatabase,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private route: ActivatedRoute
  ) {}
  getProducts() {
    return this.afs.collection(`/products/`).valueChanges();
  }

  getProduct(productId: string) {
    // if (!productId) return;
    return this.afs.collection(`/products/`).doc(productId).valueChanges();
  }
  getRandomProducts(numberProduct: number): Observable<any[]> {
    return this.afs
      .collection('products')
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          const products = documentChanges.map((doc) => {
            const data = doc.payload.doc.data();
            const id = doc.payload.doc.id;
            return { id, ...data };
          });

          const randomProducts: any[] = [];

          while (randomProducts.length < 5) {
            const randomIndex = Math.floor(Math.random() * products.length);
            if (!randomProducts.includes(products[randomIndex])) {
              randomProducts.push(products[randomIndex]);
            }
          }

          return randomProducts;
        })
      );

    // .valueChanges()
    // .pipe(
    //   map((products) => {
    //     const randomProducts: any[] = [];

    //     while (randomProducts.length < numberProduct) {
    //       const randomIndex = Math.floor(Math.random() * products.length);
    //       if (!randomProducts.includes(products[randomIndex])) {
    //         randomProducts.push(products[randomIndex]);
    //       }
    //     }

    //     return randomProducts;
    //   })
    // );
  }

  getProductbyBrand(brand: string) {
    let query = (ref: CollectionReference) => {
      let collection = ref.where('product_header.brand', '==', brand).limit(12);

      return collection;
    };
    return this.afs
      .collection('/products/', query)
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          return documentChanges.map(
            (documentChange: DocumentChangeAction<any>) => {
              const documentId = documentChange.payload.doc.id;
              const documentData = documentChange.payload.doc.data();
              return { id: documentId, ...documentData };
            }
          );
        })
      );
  }

  getProductSegment(type: string, productPrice: number) {
    let query = (ref: CollectionReference) => {
      let collection = ref.where('product_type', '==', type);
      if (productPrice > 2000000) {
        collection = collection
          .where('product_header.price', '>', productPrice - 2000000)
          .where('product_header.price', '<=', productPrice + 2000000);
      } else {
        collection = collection
          .where('product_header.price', '>', productPrice)
          .where('product_header.price', '<=', productPrice + 2000000);
      }
      return collection;
    };
    return this.afs
      .collection('/products/', query)
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          return documentChanges.map(
            (documentChange: DocumentChangeAction<any>) => {
              const documentId = documentChange.payload.doc.id;
              const documentData = documentChange.payload.doc.data();
              return { id: documentId, ...documentData };
            }
          );
        })
      );
  }

  getProductsByCondition(
    type?: string,
    brands?: string[],
    maxPrice?: number,
    minPrice?: number,
    sort?: string
  ): Observable<any> {
    let query = (ref: CollectionReference) => {
      let collection = ref.where('product_type', '==', type);

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

    return this.afs
      .collection('/products/', query)
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          return documentChanges.map(
            (documentChange: DocumentChangeAction<any>) => {
              const documentId = documentChange.payload.doc.id;
              const documentData = documentChange.payload.doc.data();
              return { id: documentId, ...documentData };
            }
          );
        })
      );
  }
}
