import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { FacadeServiceService } from '../services/facade-service.service';
import { NavbarService } from '../services/navbar.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(private facadeService: FacadeServiceService,
    public authService: AuthServiceService,private router:Router) { }

  ngOnInit(): void {
    this.facadeService.showVerify();
    this.facadeService.hide();
    
    
  }
  sendVerif(){
    this.facadeService.SendVerificationMail();
    this.facadeService.openSuccesSnackBar("Email Resent!")

  }
  gotToLogin(){
    this.router.navigateByUrl('/login');
  }
}
