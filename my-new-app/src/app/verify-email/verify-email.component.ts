import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  constructor(public authService: AuthServiceService, private utilis:UtilsService,private router:Router,) { }

  ngOnInit(): void {
    
  }
  sendVerif(){
    this.authService.SendVerificationMail();
    this.utilis.openSuccesSnackBar("Email Resent!")

  }
  gotToLogin(){
    this.router.navigateByUrl('/login');
  }
}
