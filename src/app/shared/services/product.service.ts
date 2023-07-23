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
import { BehaviorSubject, Observable, Subject, tap, of, timer } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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

  search(term: string) {
    if (term == '') return of([]);
    return this.afs
      .collection('products')
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          const products = documentChanges.map((doc) => {
            const data = doc.payload.doc.data();
            const id = doc.payload.doc.id;
            const productType = data.product_type;
            const productImage = data.product_images[0];
            const productName = data.product_header.title;
            return { id, productName, productType, productImage };
          });
          console.log(products);
          return products;
        })
      );
  }

  getProducts() {
    return this.afs
      .collection('/products/')
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

  saveProductToLocal(product: any) {
    const dataLocal = localStorage.getItem('products');

    if (!dataLocal) {
      localStorage.setItem('products', JSON.stringify([product]));
      return;
    }

    const arrData: any[] = JSON.parse(dataLocal);

    if (
      arrData.findIndex((item) => {
        console.log(item.productId, product.productId);
        return item.productId === product.productId;
      }) !== -1
    ) {
      return;
    }
    arrData.unshift(product);
    localStorage.setItem('products', JSON.stringify(arrData));
  }

  addProduct(productData: any) {
    console.log('run');
    return this.afs
      .collection('products')
      .add(productData)
      .then(
        () => {
          Swal.fire({
            title: 'Add product successful!',
            timer: 1000,
            icon: 'success',
          });
        },
        (err) => {
          Swal.fire({
            icon: 'error',
            title: err,
          });
        }
      );
  }

  updateProduct(productItem: any, productId: string) {
    const productDocRef = this.afs.collection('products').doc(productId);

    console.log(productItem, productId);
    return this.deleteProduct(productId).then(() => {
      this.afs
        .collection('products')
        .add(productItem)
        .then(() => {
          Swal.fire({
            title: 'update product successful!',
            timer: 1000,
            icon: 'success',
          });
        })
        .catch((error) => {
          console.error('Error updating product:', error);
        });
    });
  }

  deleteProduct(productId: string) {
    const productDocRef = this.afs.collection('products').doc(productId);

    return productDocRef.delete();
    // .then(() => {
    //   Swal.fire({
    //     title: 'update product successful!',
    //     timer: 1000,
    //     icon: 'success',
    //   });
    // })
    // .catch((error) => {
    //   console.error('Error updating cart:', error);
    // });
  }
}
