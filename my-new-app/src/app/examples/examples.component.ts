import { Component, OnInit } from '@angular/core';
import { Examples } from '../data/examples';
import { FacadeServiceService } from '../services/facade-service.service';
import { NavbarService } from '../services/navbar.service';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  numbersFirst:any;
  numbersMiddle:any;
  numbersLast:any;
  where:number=1;

  constructor( private facadeService:FacadeServiceService) { 
    this.numbersFirst = Array(30 - 20 ).fill(0).map((_, idx) => 20 + idx).reverse();
    
    this.numbersMiddle=Array(20-10).fill(0).map((_, idx) => 10 + idx).reverse();
    this.numbersLast=Array(10).fill(0).map((x, i) => i).reverse();

  }

  stringObject: Examples = new Examples;
  serverData: JSON | undefined;
  stringJson: any;
  robot:string="";

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
    

    this.facadeService.getExamples().subscribe(data => {
      console.log(data);
      this.serverData = data as JSON;
      this.stringJson = JSON.stringify(this.serverData);
      this.stringObject = JSON.parse(this.stringJson);
    });
  
  }
  seeMore(){
    this.where=2;
  }
  seeMore2(){
    this.where=3;
  }
  

}
