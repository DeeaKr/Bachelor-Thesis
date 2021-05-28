import { Injectable, Injector } from '@angular/core';
import { AuthServiceService } from './auth-service.service';
import { NavbarService } from './navbar.service';
import { UploadService } from './upload.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
//design pattern facade
export class FacadeServiceService {

  private _authService: AuthServiceService | undefined;
  public get authService(): AuthServiceService {
    if(!this._authService){
      this._authService = this.injector.get(AuthServiceService);
    }
    return this._authService;
  }
  private _navService: NavbarService | undefined;
  public get navService(): NavbarService {
    if(!this._navService){
      this._navService = this.injector.get(NavbarService);
    }
    return this._navService;
  }
  private _utilisService: UtilsService | undefined;
  public get utilisService(): UtilsService {
    if(!this._utilisService){
      this._utilisService = this.injector.get(UtilsService);
    }
    return this._utilisService;
  }

  private _uploadService: UploadService | undefined;
  public get uploadService(): UploadService {
    if(!this._uploadService){
      this._uploadService = this.injector.get(UploadService);
    }
    return this._uploadService;
  }
  
  
  constructor(private injector: Injector) { 
    
   }

  
  SignIn(email:string,password: string) {
    return this.authService.SignIn(email,password);
  }
  SignUp(email:string,password:string,robot:string,name:string) {
    return this.authService.SignUp(email,password,robot,name);
  }
  SignOut(){
    return this.authService.SignOut();
  }
  SendVerificationMail(){
    return this.authService.SendVerificationMail();
  }
  getRobot(email:any){
    return this.uploadService.getRobot(email);
  }
  getDisplayName(email:any){
    return this.uploadService.getDisplayName(email);
    
  }
  getTop(){
    return this.uploadService.getTop();
    
  }
  getExamples(){
    return this.uploadService.getExamples();
  }

  hide(){
    return this.navService.hide();
  }
  show(){
    return this.navService.show();
  }

  

  hideRegister(){
    return this.navService.hideRegister();
  }
}
