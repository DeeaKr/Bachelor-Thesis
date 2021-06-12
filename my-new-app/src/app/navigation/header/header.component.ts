import { Component, EventEmitter, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarService } from 'src/app/services/navbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { RegisterService } from 'src/app/services/register.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { auth } from 'firebase';
import { Observable } from 'rxjs';
import { FacadeServiceService } from 'src/app/services/facade-service.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnChanges {
  @Output() public sidenavToggle = new EventEmitter();
  route: string = '';
  name:string='';
  LoginStatus$ : Observable<boolean>;

  email$ : Observable<string>;

  constructor(
    public location: Location,
    public router: Router,
    public nav: NavbarService,
    private facadaService:FacadeServiceService,
    
  ) {
    router.events.subscribe((val) => {
      this.route = location.path();
    });
    this.LoginStatus$ = this.facadaService.isLoggedInUser;

    this.email$ = this.facadaService.getEmailObs;
  }
 
  ngOnInit(): void {
   
    let user=JSON.parse(localStorage.getItem('user') || '{}');
    var email=user.email;
    console.log("header: ");
    this.email$.subscribe(val=>
      {
        console.log(val);
        if(val!=null){
   
          this.facadaService.getDisplayName(val).subscribe(
            res=>{
              console.log(res);
              this.name=String(res);
              
            }
          );
          }

      });
    
  
  }
  ngOnChanges(): void{
    let user=JSON.parse(localStorage.getItem('user') || '{}');
    var email=user.email;
    console.log("header: ");
    this.email$.subscribe(val=>
      {
        console.log(val);
        if(val!=null){
   
          this.facadaService.getDisplayName(val).subscribe(
            res=>{
              console.log(res);
              this.name=String(res);
              
            }
          );
          }

      });
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  deleteGotoLogin(){
    this.facadaService.SignOut();
  }

}
