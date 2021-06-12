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
  get isLoggedInUser(){
    return this.authService.isLoggedInUser;
  }
  get getEmailObs(){
    return this.authService.getEmailObs;
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
  onUpload(file:File,email:any){
    return this.uploadService.onUpload(file,email);
  }

  hide(){
    return this.navService.hide();
  }
  show(){
    return this.navService.show();
  }
  hideVerify(){
    return this.navService.hideVerify();
  }
  showVerify(){
    return this.navService.showVerify();
  }
showRegister(){
  return this.navService.showRegister();
}
  hideRegister(){
    return this.navService.hideRegister();
  }

  openFailSnackBar(message: string) {
    return this.utilisService.openFailSnackBar(message);
  }
  openSuccesSnackBar(message: string) {
    return this.utilisService.openSuccesSnackBar(message);
  }

}
