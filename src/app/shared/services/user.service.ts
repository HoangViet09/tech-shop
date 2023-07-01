import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import Swal from 'sweetalert2';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';

import { Router } from '@angular/router';
import { user } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userDataSubject: Subject<any> = new BehaviorSubject<any>({}); // Save logged in user data
  get userData$(): Observable<any> {
    return this.userDataSubject.asObservable();
  }
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    private router: Router
  ) {
    // this.userData$.subscribe((res) => {
    //   console.log(res);
    // });
  }
  getUser(userId: string) {
    if (!userId) return;
    return this.afs
      .collection(`/users/`, (ref) => ref.where('uid', '==', userId))
      .valueChanges()
      .pipe(
        tap((res) => {
          // console.log(res);
          this.userDataSubject.next(res);
        })
      )
      .subscribe((res) => {});
  }

  getListUser() {
    return this.afs.collection('/users').valueChanges();
  }

  updateProfile(userId: string, profileData: any) {
    // console.log('user playload', profileData);
    // console.log('user id', userId);
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userId}`
    );

    return userRef
      .set(profileData, {
        merge: true,
      })
      .then(() => {
        console.log('Profile updated successfully');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  }

  removeUser(userId: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${userId}`
    );
    return userRef.delete();
  }

  addToCart(
    userId: string,
    productId: string,
    productQuantity: number,
    colorProduct: { [color: string]: number },
    productData: any
  ) {
    const cartItem = { productId, productQuantity, colorProduct, productData };

    const userDocRef = this.afs.collection('users').doc(userId);

    userDocRef.get().subscribe((userDocSnapshot) => {
      const userData = userDocSnapshot.data() as { cart?: any[] };

      if (userData && userData.cart) {
        const cart = userData.cart;
        const existingItem = cart.find(
          (item: any) =>
            item.productId === productId &&
            this.areColorProductsEqual(item.colorProduct, colorProduct)
        );
        console.log(existingItem);
        if (existingItem) {
          existingItem.productQuantity += productQuantity;
        } else {
          cart.push(cartItem);
        }

        userDocRef
          .update({ cart })
          .then(() => {
            console.log('cart updated successfully');
            Swal.fire({
              icon: 'success',
              title: 'Thêm thành công sản phẩm vào giỏ!',
              showDenyButton: true,
              showCloseButton: true,
              // showCancelButton: true,
              confirmButtonText: 'đi tới giỏ hàng',
              denyButtonText: `Tiếp tục mua sắm`,
              timer: 1500,
            }).then((result) => {
              if (result.isConfirmed) return this.navigateToCart();
              Swal.close();
            });
          })
          .catch((error) => {
            console.error('Error updating cart:', error);
          });
      } else {
        userDocRef
          .set({ cart: [cartItem] })
          .then(() => {
            console.log('cart add item successfully');
            Swal.fire({
              icon: 'success',
              title: 'Thêm thành công sản phẩm vào giỏ!',
              showDenyButton: true,
              showCloseButton: true,
              // showCancelButton: true,
              confirmButtonText: 'đi tới giỏ hàng',
              denyButtonText: `Tiếp tục mua sắm`,
              timer: 1500,
            }).then((result) => {
              if (result.isConfirmed) return this.navigateToCart();
              Swal.close();
            });
          })
          .catch((error) => {
            console.error('Error adding cart:', error);
          });
      }
    });
  }

  navigateToCart() {
    this.router.navigate(['cart']);
  }

  updateCart(
    cartItem: any,
    userId: string,
    colorProduct?: { [color_label: string]: number },
    ProductQuantity?: number
  ) {
    const userDocRef = this.afs.collection('users').doc(userId);

    userDocRef.get().subscribe((userDocSnapshot) => {
      const userData = userDocSnapshot.data() as { cart?: any[] };
      const cart: any = userData.cart;
      const existingItem = cart.find(
        (item: any) => item.productId === cartItem.productId
      );

      if (ProductQuantity) {
        existingItem.productQuantity = ProductQuantity;
        console.log(ProductQuantity);
      } else {
        existingItem.colorProduct = colorProduct;
      }
      userDocRef
        .update({ cart })

        .catch((error) => {
          console.error('Error updating cart:', error);
        });
    });
  }
  removeCart(userId: string) {
    const userDocRef = this.afs.collection('users').doc(userId);
    userDocRef.get().subscribe((userDocSnapShot) => {
      const userData = userDocSnapShot.data() as { cart?: any[] };
      let cart: any = userData.cart;
      cart = [];
      userDocRef.update({ cart }).catch((error) => {
        console.error('Error updating cart:', error);
      });
    });
  }
  removeCartItem(cartItem: any, userId: string) {
    const userDocRef = this.afs.collection('users').doc(userId);

    userDocRef.get().subscribe((userDocSnapshot) => {
      const userData = userDocSnapshot.data() as { cart?: any[] };
      const cart: any = userData.cart;
      const indexItem = cart.findIndex(
        (item: any) => item.productId === cartItem.productId
      );
      cart.splice(indexItem, 1);
      userDocRef
        .update({ cart })

        .catch((error) => {
          console.error('Error updating cart:', error);
        });
    });
  }

  areColorProductsEqual(
    cp1: { [color: string]: number },
    cp2: { [color: string]: number }
  ): boolean {
    const cp1Keys = Object.keys(cp1);
    const cp2Keys = Object.keys(cp2);

    if (cp1Keys.length !== cp2Keys.length) {
      return false;
    }

    for (const color of cp1Keys) {
      if (!cp2Keys.includes(color) || cp1[color] !== cp2[color]) {
        return false;
      }
    }

    return true;
  }
}
