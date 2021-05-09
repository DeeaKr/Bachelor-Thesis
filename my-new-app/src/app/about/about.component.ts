import { Component, OnInit } from '@angular/core';
import { PhotoResult } from '../data/photoResult';
import { NavbarService } from '../services/navbar.service';
import { RegisterService } from '../services/register.service';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  numbers: any;

  constructor(private nav: NavbarService, private uploadService: UploadService, private registerService:RegisterService) {
    this.numbers = Array(10).fill(0).map((x, i) => i).reverse();
    
  }
  numberInTop:any;
  inTop:boolean=false;
  stringObject: PhotoResult = new PhotoResult;
  serverData: JSON | undefined;
  stringJson: any;
  places: Array<Number> = [];
  ngOnInit(): void {
    this.nav.show();

    this.uploadService.getTop().subscribe(data => {
      this.serverData = data as JSON;
      this.stringJson = JSON.stringify(this.serverData);
      this.stringObject = JSON.parse(this.stringJson);
      // this.stringObject.emails.forEach((element: string | null) => {
      //   if (element== this.registerService.getEmail()){
      //       this.inTop=true;
            

      //   }
      // });
      let i;
      
      for(i=this.stringObject.emails.length-1;i>=0;i--){
        if(this.stringObject.emails[i]==this.registerService.getEmail()){
          this.inTop=true;
          this.places.push(i+1);
        }
      }
      console.log(this.places);

    });
  }

}
