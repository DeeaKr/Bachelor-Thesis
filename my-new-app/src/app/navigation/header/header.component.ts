import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarService } from 'src/app/services/navbar.service';
import { UploadService } from 'src/app/services/upload.service';
import { RegisterService } from 'src/app/services/register.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();
  route: string = '';
  name:string='';

  constructor(
    public location: Location,
    public router: Router,
    public nav: NavbarService,
    public uploadService: UploadService,
    private registerService:RegisterService
  ) {
    router.events.subscribe((val) => {
      this.route = location.path();
    });
  }

  ngOnInit(): void {
    var email=this.registerService.getEmail();
    if(email!=null){
   
    this.uploadService.getDisplayName(email).subscribe(
      res=>{
        console.log(res);
        this.name=String(res);
        
      }
    );
    }
  }
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
  deleteGotoLogin(){
    
  }

}
