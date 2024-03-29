import { Injectable, NgZone } from '@angular/core';
import { User } from '../services/user';
import * as auth from 'firebase/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;
  totalProduct: number = 0;

  userAuthSubject: Subject<any> = new BehaviorSubject<any>({}); // Save logged in user data
  get userAuth$(): Observable<any> {
    return this.userAuthSubject;
  }
  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState
      .pipe(
        tap((res) => {
          // console.log(res);
          this.userAuthSubject.next(res);
        })
      )
      .subscribe((user) => {
        // console.log('logged in and logged out setting');
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user')!);
        } else {
          localStorage.setItem('user', 'null');
          JSON.parse(localStorage.getItem('user')!);
        }
      });
    // this.userAuth$.subscribe((res) => {
    //   console.log(res);
    // });
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(async (result) => {
        await this.SetUserData(result.user);
        this.afAuth.authState.subscribe((user) => {
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email: string, password: string) {
    // const userData: User = {
    //   uid: user.uid,
    //   email: user.email,
    //   displayName: user.displayName,
    //   photoURL: user?.photoURL,
    //   emailVerified: user?.emailVerified,
    // };
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    console.log('user loggin');
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider()).then((res: any) => {});
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth
      .signInWithPopup(provider)
      .then(async (result) => {
        await this.SetUserData(result.user);

        this.afAuth.authState.subscribe((user) => {
          console.log(user);
          if (user) {
            this.router.navigate(['dashboard']);
          }
        });
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user?.photoURL,
      emailVerified: user?.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth
      .signOut()
      .then(() => {
        this.totalProduct = 0;
        this.userData = undefined;
        localStorage.removeItem('user');
        // this.router.navigate(['sign-in']);
      })
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Bạn đã đăng xuất',
          timer: 1500,
        });
        return this.router.navigate(['dashboard']);
      });
  }
}
