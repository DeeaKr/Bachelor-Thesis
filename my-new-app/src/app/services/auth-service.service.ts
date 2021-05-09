import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import{AngularFireDatabase} from "@angular/fire/database"
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';
import { UserFb } from '../data/userFirebase';
import { UserDb } from '../data/userDatabase';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  userData: any;
  


  constructor( public afs: AngularFirestore,    // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone,
    private utilsService:UtilsService,
    private db: AngularFireDatabase) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
         
          JSON.parse(localStorage.getItem("user") || '{}');
        } else {
          localStorage.setItem("user", "");
          JSON.parse(localStorage.getItem('user') || '{}');
        }
      });

   }



   SignIn(email:string, password:string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result:any) => {
        this.ngZone.run(() => {
          this.router.navigate(['home']);
          this.utilsService.openSuccesSnackBar("Successfully logged in");
        });
        this.SetUserData(result.user);
      }).catch((error:any) => {
        
        this.utilsService.openFailSnackBar(error.message);
      })
  }

  SignUp(email:string, password:string, robot:string, name:string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result:any) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        let newUser: UserDb = {
          name: name,
      
          email: email,
          robot: robot
        };
        this.db.list('usersRobots').push(newUser);
        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error:any) => {
        this.utilsService.openFailSnackBar(error.message);
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    let user= this.afAuth.auth.currentUser;
    if(user!= null){
    return user.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email-address']);
    });
    
  }
  return null;
  //  (): Promise<void> =>
  // this.afAuth.auth.currentUser  
  //   ? this.afAuth.auth.currentUser .sendEmailVerification().then(()=>{
  //     this.router.navigate(['verify-email-address']);
  //   })
  //   : Promise.resolve()
    // return this.afAuth.auth.currentUser.sendEmailVerification()
    // .then(() => {
    //   this.router.navigate(['verify-email-address']);
    // })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  SetUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: UserFb = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
   

  }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }
}
