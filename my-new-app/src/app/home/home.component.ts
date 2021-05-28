import { Component, HostBinding, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { trigger, state, style, animate, transition , query, stagger} from '@angular/animations';
import { NavbarService } from '../services/navbar.service';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { PhotoResult } from '../data/photoResult';
import { AuthServiceService } from '../services/auth-service.service';
import { FacadeServiceService } from '../services/facade-service.service';
import { UtilsService } from '../services/utils.service';

export interface Robot {
  value: string;
  viewValue: string;
  img: string;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    // trigger(
    //   'inOutAnimation', 
    //   [
    //     transition(
    //       ':enter', 
    //       [
    //         style({ width: 0, opacity: 0 }),
    //         animate('1s ease-out', 
    //                 style({ width: 300, opacity: 1 }))
    //       ]
    //     ),
    //     transition(
    //       ':leave', 
    //       [
    //         style({ width: 300, opacity: 1 }),
    //         animate('1s ease-in', 
    //                 style({ width: 0, opacity: 0 }))
    //       ]
    //     )
    //   ]
    // ),
      trigger('inOutAnimation', [
        state('in', style({ transform: 'translateX(0)' })),
        transition('void => *', [
          style({ transform: 'translateX(-100%)' }),
          animate(600)
        ]),
        transition('* => void', [
          animate(300, style({ transform: 'translateX(100%)' }))
        ])
      ]),
      trigger('pageAnimations', [
        transition(':enter', [
          query('#welcome,  .photoC, .add-photo, #helloRobot, #helloRobotPurple, #helloRobotR2D2', [
            style({opacity: 0, transform: 'translateY(-100px)'}),
            stagger(-30, [
              animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'none' }))
            ])
          ])
        ])
      ]),
    
  ]
})
export class HomeComponent implements OnInit {
  @HostBinding('@pageAnimations')
  public animatePage = true;
  hide:boolean=false;
  happy:string='normal';
  selectedValue:string='';
  name:string='';
  robot:string='';
  email:any;
  constructor(private uploadService: UploadService, private nav: NavbarService, public router: Router
    ,private registerService:RegisterService, private authService:AuthServiceService, private utilisService:UtilsService) { }
  stringObject: PhotoResult = new PhotoResult;
  serverData: JSON | undefined;
  public imagePath = '';
  imgURL: any;
  public message: string = '';
  result:number=0;
  robots: Robot[] = [
    { value: 'blueRobot-0', viewValue: 'Blue Robot', img: 'assets/images/helloRobotblue.png' },
    { value: 'purpleRobot-1', viewValue: 'Purple Robot', img: 'assets/images/helloRobotPurple.png' },
    { value: 'tacos-2', viewValue: 'Tacos', img: 'https://www.akberiqbal.com/favicon-16x16.png' }
  ];
  stringJson:any;


  preview(files: any) {
    
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      this.utilisService.openFailSnackBar(this.message);
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.hide=true;
      
      this.uploadService.onUpload(files[0],this.email).subscribe(
        res=>
        {
          console.log(res);
          var r=Number(res);
          this.result=Number(res);
          if(r>=0.5){
            this.happy='happy';
          }
          else{
            this.happy='sad';
          }
        }
      );
      this.imgURL = reader.result;
    }
  }

  gotoExamples(){
    this.router.navigateByUrl('/examples');
  }
  ngOnInit(): void {
    let user=JSON.parse(localStorage.getItem('user') || '{}');
    this.email=user.email;
    // this.email=this.authService.userData.email;
    this.nav.show();
    this.uploadService.getDisplayName(this.email).subscribe(
      res=>{
       
        this.name=String(res);
        
      }
    );
    this.uploadService.getRobot(this.email).subscribe(
      res=>{
        
        this.robot=String(res);
      }
    );
    // this.uploadService.getTop().subscribe(data =>{
    //   this.serverData = data as JSON;
    //   this.stringJson = JSON.stringify(this.serverData);
    //   this.stringObject = JSON.parse(this.stringJson);
    //   console.log("JSON object -", this.stringObject);
    //   console.log("email:" , this.stringObject.emails[0]);
    //   console.log(this.serverData);
    // });
    
  }

}
