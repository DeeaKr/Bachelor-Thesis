import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserPart } from '../data/userPart';
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
  message = '';
  
  hideP=true;

  emailDomains: string[] = ['@GMAIL.COM','@YAHOO.COM','@YAHOO.RO'];
  constructor(private nav:NavbarService, private registerService:RegisterService, private router:Router, private utilsService:UtilsService) { }

  ngOnInit(): void {
    this.nav.hideRegister();
    this.nav.hide();
  }
  
  login(): void {

    if (this.validateInputs()) {
      let newUser: UserPart = {
       
      
        email: this.loginForm.controls['emailCtrl'].value,
        
        password: this.loginForm.controls['passwordCtrl'].value,
      };

      this.registerService.loginUser(newUser).subscribe(
        (res) => {
         
        },
        (res) => {
          
          this.message = '';

          if (res.statusText == 'Unknown Error') {
            this.message += 'Server is not working!';
            this.utilsService.openFailSnackBar(this.message);
          }
          else if(res.statusText == 'OK'){
            this.router.navigateByUrl('/home');
            this.message+="Succesfully logged in";
            this.registerService.setItem("email",this.loginForm.controls['emailCtrl'].value);
            this.utilsService.openSuccesSnackBar(this.message);
            
          } 
          else {
            // this.message += error.error.message;
            console.log(res);
            this.message+=res.error;
            this.utilsService.openFailSnackBar(this.message);
          }

          
        }
      );
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
