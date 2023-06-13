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
export class UserService {
  userDataSubject: Subject<any> = new BehaviorSubject<any>({}); // Save logged in user data
  get userData$(): Observable<any> {
    return this.userDataSubject.asObservable();
  }
  constructor(
    private db: AngularFireDatabase,
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
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

  updateProfile(userId: string, profileData: any) {
    console.log('user playload', profileData);
    console.log('user id', userId);
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
}
