import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { logFunction } from '../data/decorator';
import { User } from '../data/user';
import { AuthServiceService } from '../services/auth-service.service';
import { FacadeServiceService } from '../services/facade-service.service';
import { NavbarService } from '../services/navbar.service';
import { RegisterService } from '../services/register.service';
import { UtilsService } from '../services/utils.service';
export interface Robot {
  value: string;
  viewValue: string;
 
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  robots: Robot[] = [
    { value: 'blueRobot-0', viewValue: 'Blue Robot' },
    { value: 'purpleRobot-1', viewValue: 'Purple Robot' },
    { value: 'r2d2-2', viewValue: 'R2D2' },
    {value: 'walle-3',viewValue:'Wall-e'}
  ];
  registerForm = new FormGroup({
    emailCtrl: new FormControl('', [Validators.required, Validators.email]),
    nameCtrl: new FormControl('', [Validators.required]),
    selectedCtrl:new FormControl('', [Validators.required]),
    passwordCtrl: new FormControl('', [Validators.required]),
  });
  message = '';
  nameErrorMessage: String = "This is not a valid name!";
  hideP=true;
  selectedValue:string='';
  emailDomains: string[] = ['@GMAIL.COM','@YAHOO.COM','@YAHOO.RO'];
  public lottieConfig: Object | undefined;
  private anim: any;
  private animationSpeed: number = 1;
  constructor(  private utilsService: UtilsService,
    private router: Router,
    public nav: NavbarService,
    private registerService:RegisterService, private authService : AuthServiceService, private facadeService:FacadeServiceService) {
      this.lottieConfig = {
        path: "https://assets7.lottiefiles.com/packages/lf20_xldshlit.json",
        renderer: 'canvas',
        autoplay: true,
        loop: true,
        speed:1
    };
    
     }


  
  ngOnInit(): void {
    this.nav.hide();
    this.nav.showRegister();
    this.selectedValue=this.registerForm.controls['selectedCtrl'].value;
  }

  @logFunction()
  register(): void {
    
    if (this.validateInputs()) {
      //this.authService.SignUp(...) was before
      this.facadeService.SignUp(this.registerForm.controls['emailCtrl'].value,this.registerForm.controls['passwordCtrl'].value,
      this.registerForm.controls['selectedCtrl'].value,this.registerForm.controls['nameCtrl'].value);

      // let newUser: User = {
       
      //   name: this.registerForm.controls['nameCtrl'].value,
      //   email: this.registerForm.controls['emailCtrl'].value,
      //   robot: this.registerForm.controls['selectedCtrl'].value,
      //   password: this.registerForm.controls['passwordCtrl'].value,
      // };

      // this.registerService.registerUser(newUser).subscribe(
      //   (res) => {
         
      //   },
      //   (res) => {
          
      //     this.message = '';

      //     if (res.statusText == 'Unknown Error') {
      //       this.message += 'Server is not working!';
      //     }
      //     else if(res.statusText == 'OK'){
      //       this.router.navigateByUrl('/home');
      //       this.message+="Succesfully registered";
      //       this.registerService.setItem("email",this.registerForm.controls['emailCtrl'].value);
            
      //     } 
      //     else {
      //       // this.message += error.error.message;
      //       this.message+=res.error;
      //     }

      //     this.utilsService.openFailSnackBar(this.message);
      //   }
      // );
    }
  }


  validateInputs(){
    let valid=true;
    this.nameErrorMessage = 'This is not a valid name!';
    var splitSpaceName = this.registerForm.controls['nameCtrl'].value.split(" ");
    if (splitSpaceName.length < 2) {
      this.registerForm.controls['nameCtrl'].setErrors({ 'invalid': true });
      this.nameErrorMessage = "Please enter both your name and surname!";
      valid = false;
    }
    let email = this.registerForm.controls['emailCtrl'].value.toUpperCase();
    let emailValid = false;
    this.emailDomains.forEach(element => {
      if (email.endsWith(element)) {
        emailValid = true;
      }
    });
    if (!emailValid) {
      this.registerForm.controls['emailCtrl'].setErrors({ 'invalid': true });
      valid = false;
    }


    return valid;


  }

}
