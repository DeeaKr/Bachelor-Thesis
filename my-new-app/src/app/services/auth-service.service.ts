import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  test: any;


  constructor( public afs: AngularFirestore,    // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone,
    private utilsService:UtilsService,
    private db: AngularFireDatabase) {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          //this.userData = user;
         // localStorage.setItem('user', JSON.stringify(this.userData));
         
          //JSON.parse(localStorage.getItem("user") || '{}');
        } else {
          //localStorage.setItem("user", '');
          //JSON.parse(localStorage.getItem('user') || '{}');
        }
      });

   }
   private loginStatus = new BehaviorSubject<boolean>(this.isLoggedIn);
   private email    = new BehaviorSubject<string>(this.getEmail());



   SignIn(email:string, password:string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result:any) => {
        this.ngZone.run(() => {
          //this.SetUserData(result.user);
          this.router.navigate(['home']).then(() => {
            var verified=JSON.parse(localStorage.getItem('user') || '{}').emailVerified;
            if(verified !== undefined  && verified!== false) 
            { 
              this.utilsService.openSuccesSnackBar("Successfully logged in");
            }
            else{
           
            this.utilsService.openFailSnackBar("Verify your email first!");
            }
          });;
         
        });
        this.loginStatus.next(true);
       this.SetUserData(result.user);
       this.email.next(JSON.parse(localStorage.getItem('user') || '{}').email);
      }).catch((error:any) => {
        if(error.message.includes("There is no user record")){
          this.utilsService.openFailSnackBar("There is no user registered with this email");

        }
         else{ 
        
        this.utilsService.openFailSnackBar(error.message);
         }
      })
  }

  getEmail(){
    var email;
    email=JSON.parse(localStorage.getItem('user') || '{}').email;

    return email;
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
        
        this.SetUserData(result.user);
        this.SendVerificationMail();
      }).catch((error:any) => {
        this.utilsService.openFailSnackBar(error.message);
      })
  }
  // getEmail(){
  //   return this.userData.email;
  // }

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
   
    if(user.emailVerified !== undefined  && user.emailVerified !== false) 
    { 
      return true; 
    }
    else{ 
      return false;
    }
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
    localStorage.setItem('user', JSON.stringify(userData));
    return userRef.set(userData, {
      merge: true
    })
   

  }
  get isLoggedInUser() 
    {
        return this.loginStatus.asObservable();
    }

    get getEmailObs() 
    {
        return this.email.asObservable();
    }

  // Sign out 
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.loginStatus.next(false);
      this.router.navigateByUrl('login').then(() => {
        window.location.reload();
      });;
      
    })
  }
}
