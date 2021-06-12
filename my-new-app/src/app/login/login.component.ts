import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { logFunction } from '../data/decorator';
import { UserPart } from '../data/userPart';
import { AuthServiceService } from '../services/auth-service.service';
import { FacadeServiceService } from '../services/facade-service.service';
import { NavbarService } from '../services/navbar.service';
import { RegisterService } from '../services/register.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    emailCtrl: new FormControl('', [Validators.required, Validators.email]),
    passwordCtrl: new FormControl('', [Validators.required]),
  });
  // message = '';
  
  hideP=true;

  emailDomains: string[] = ['@GMAIL.COM','@YAHOO.COM','@YAHOO.RO'];
  constructor( private router:Router, 
     private facadeService:FacadeServiceService) { 
      
    }


  ngOnInit(): void {
    let user=JSON.parse(localStorage.getItem('user') || '{}');
    if(user.email!=null){
      this.router.navigate(['home']);
    }
    this.facadeService.hideRegister();
    this.facadeService.hide();
    this.facadeService.navService.hideVerify();

  }
  //design pattern decorator
  @logFunction()
  login(): void {
   
    console.log(this.loginForm.controls['emailCtrl'].value);
    if (this.validateInputs()) {
      //this.authService.SignIn
      this.facadeService.SignIn(this.loginForm.controls['emailCtrl'].value,this.loginForm.controls['passwordCtrl'].value);
      // let newUser: UserPart = {
       
      
      //   email: this.loginForm.controls['emailCtrl'].value,
        
      //   password: this.loginForm.controls['passwordCtrl'].value,
      // };

      // this.registerService.loginUser(newUser).subscribe(
      //   (res) => {
         
      //   },
      //   (res) => {
          
      //     this.message = '';

      //     if (res.statusText == 'Unknown Error') {
      //       this.message += 'Server is not working!';
      //       this.utilsService.openFailSnackBar(this.message);
      //     }
      //     else if(res.statusText == 'OK'){
      //       this.router.navigateByUrl('/home');
      //       this.message+="Succesfully logged in";
      //       this.registerService.setItem("email",this.loginForm.controls['emailCtrl'].value);
      //       this.utilsService.openSuccesSnackBar(this.message);
            
      //     } 
      //     else {
      //       // this.message += error.error.message;
      //       console.log(res);
      //       this.message+=res.error;
      //       this.utilsService.openFailSnackBar(this.message);
      //     }

          
      //   }
      // );
    }
  }

  validateInputs(){
    let valid=true;
  
   
    let email = this.loginForm.controls['emailCtrl'].value.toUpperCase();
    let emailValid = false;
    this.emailDomains.forEach(element => {
      if (email.endsWith(element)) {
        emailValid = true;
      }
    });
    if (!emailValid) {
      this.loginForm.controls['emailCtrl'].setErrors({ 'invalid': true });
      valid = false;
    }


    return valid;


  }

}
