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
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(public afs: AngularFirestore, public afAuth: AngularFireAuth) {}

  getAllOrder() {
    return this.afs
      .collection('/orders')
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          return documentChanges.map(
            (documentChange: DocumentChangeAction<any>) => {
              const id = documentChange.payload.doc.id;
              const documentData = documentChange.payload.doc.data();
              return { id, ...documentData };
            }
          );
        })
      );
  }

  getOrderByUser(userId: string) {
    let query = (ref: CollectionReference) => {
      let collection = ref.where('orderItem.userId', '==', userId);

      return collection;
    };
    return this.afs
      .collection('/orders/', query)
      .snapshotChanges()
      .pipe(
        map((documentChanges: DocumentChangeAction<any>[]) => {
          return documentChanges.map(
            (documentChange: DocumentChangeAction<any>) => {
              const documentData = documentChange.payload.doc.data();
              return documentData;
            }
          );
        })
      );
  }

  addOrder(
    userId: string,
    orderTime: string,
    orderPayment: string,
    productData: any,
    orderDesc: any,
    totalPrice: any
  ) {
    const orderItem = {
      userId,
      orderTime,
      orderPayment,
      productData,
      orderDesc,
      totalPrice,
    };

    const userDocRef = this.afs.collection('orders');
    return userDocRef.add({ orderItem });
  }

  changeStateOrder(orderId: string) {
    const orderRef = this.afs.collection('orders').doc(orderId);

    orderRef.get().subscribe((userDocSnapshot) => {
      const orderData = userDocSnapshot.data() as {
        orderItem: { state?: string };
      };

      switch (orderData.orderItem.state) {
        case undefined:
          orderData.orderItem.state = 'Confirm';
          console.log(orderData);
          orderRef.update(orderData);
          break;
        case 'Confirm':
          orderData.orderItem.state = 'Delivering';
          console.log(orderData);
          orderRef.update(orderData);
          break;
        case 'Delivering':
          Swal.fire({
            icon: 'question',
            title: 'Has the product delivered successfully?',
            showDenyButton: true,
            showCloseButton: true,
            // showCancelButton: true,
            confirmButtonText: 'Successful delivery',
            denyButtonText: `return to warehouse`,
          }).then((result) => {
            if (result.isConfirmed) {
              orderData.orderItem.state = 'Delivered';
              console.log(orderData);
              orderRef.update(orderData);
            } else {
              orderData.orderItem.state = 'Confirm';
              console.log(orderData);
              orderRef.update(orderData);
            }
            Swal.close();
          });

          break;
        default:
          break;
      }
    });
  }
}
