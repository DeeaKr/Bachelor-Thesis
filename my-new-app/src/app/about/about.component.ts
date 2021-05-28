import { ChangeDetectorRef, Component, KeyValueDiffer, KeyValueDiffers, OnInit } from '@angular/core';
import { PhotoR } from '../data/PhotoR';
import { PhotoResult } from '../data/photoResult';
import { Photos } from '../data/photos';
import { AuthServiceService } from '../services/auth-service.service';
import { FacadeServiceService } from '../services/facade-service.service';
import { NavbarService } from '../services/navbar.service';
import { RegisterService } from '../services/register.service';
import { UploadService } from '../services/upload.service';

class Iterable{
  [Symbol.iterator](){
    let step=0;
    const iterator={
      next(){
        step++;
        if(step< 10){
          return {value: step, done: false};
        }
        return{value:null, done: true};
      }
    };
    return iterator;
  }
}
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})

export class AboutComponent implements OnInit {

  numbers: any;
  differ: KeyValueDiffer<string, any>;

  constructor(private nav: NavbarService, private uploadService: UploadService,
     private registerService:RegisterService, private authService:AuthServiceService, private facadeService:FacadeServiceService,private differs: KeyValueDiffers) {
       
       this.differ = this.differs.find({}).create();
        
    this.numbers = Array(10).fill(0).map((x, i) => i).reverse();
  
    
  }
  ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem(item => {
        console.log('item changed', item);
      });
    }
  }
  numberInTop:any;
  inTop:boolean=false;
  stringObject: PhotoResult = new PhotoResult;
  serverData: JSON | undefined;
  stringJson: any;
  places: Array<Number> = [];
  robot:string="";
  likes:number=0;
  liked:boolean=false;

  ngOnInit(): void {
    let user=JSON.parse(localStorage.getItem('user') || '{}');
    let email=user.email;
    //this.nav
    this.facadeService.show();
    //this.uploadService
    this.facadeService.getRobot(email).subscribe(
      res=>{
        
        this.robot=String(res);
      }
    );

    //this.uploadService.getTop()
    //design pattern observer
    if(this.liked==true){
      this.likes+=1;
      this.liked=false;
    }
    // this.stringObject.emails.forEach((element: string | null) => {
      //   if (element== this.registerService.getEmail()){
      //       this.inTop=true;
            

      //   }
      // });
    this.facadeService.getTop().subscribe(data => {
      this.serverData = data as JSON;
      this.stringJson = JSON.stringify(this.serverData);
      this.stringObject = JSON.parse(this.stringJson);
      
      let objects=[];
      for(let j=0;j<=this.stringObject.emails.length;j++){
        let photoR=new PhotoR(this.stringObject.emails[j],this.stringObject.urls[j],this.stringObject.result[j],j);
        objects.push(photoR);
      }
      // iterator
      let it= new Photos(objects);  
      for(let p of it){
        if(p.email==email){
          this.inTop=true;
          this.places.push(p.place);
        }
        else{
          this.places.push(-1);
        }
      };






    //   let i;
     
    // console.log(this.stringObject.emails);
    // console.log(this.stringObject.result);      
    //   for(i=0;i<=this.stringObject.emails.length;i++){
    //     if(this.stringObject.emails[i]==email){
    //       this.inTop=true;
    //       this.places.push(i);
    //     }
    //     else {
    //       this.places.push(-1);
    //     }
    //   }
    //   console.log(this.places);

  });
  }

  like(){
    this.liked=true;
    this.ngOnInit();
  }

}
