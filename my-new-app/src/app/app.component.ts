import { Component, OnInit } from '@angular/core';
import { RegisterService } from './services/register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  photo : string='assets/images/spotlight2EditFinal2.jpg';
  constructor(
    private authenticationService: RegisterService,
    
  ) {}
  authenticated: Boolean=false;
  ngOnInit(): void {
    this.photo='assets/images/spotlight2EditFinal2.jpg';
    this.authenticationService.watchStorage().subscribe((data: string) => {
      if (localStorage.getItem('token')) {
        this.authenticated = true;
      } else {
        this.authenticated = false;
      }
      if (data === 'true') { 
        this.authenticated = false;
      }
    });
    if (localStorage.getItem('token')) {
      this.authenticated = true;
    } else {
      this.authenticated = false;
    }
  }
  title = 'my-new-app';

}
