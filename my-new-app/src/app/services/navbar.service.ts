import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  title:string='';
  visible:boolean;
  register:boolean;
  constructor() { 
    this.register=false;
    this.visible=false;}
  hide():void{
    this.visible=false;
  }
  show():void{
    this.visible=true;
  }
  hideRegister():void{
    this.register=false;
  }
  showRegister():void{
    this.register=true;
  }
  setTitle(title:string):void{
    this.title = title;
  }
  getTitle():string{
    return this.title;
  }
}
