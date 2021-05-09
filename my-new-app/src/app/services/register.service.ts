import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../data/user';
import { UserPart } from '../data/userPart';
const URL: string = "http://192.168.0.157:2021";
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private storageSub= new Subject<String>();
  constructor(private http: HttpClient) { }

  registerUser(body:User){
      console.log(body);
      return this.http.post(`${URL}/signup`,body); 
      
  }
  loginUser(body:UserPart){
    return this.http.post(`${URL}/login`,body);
  }
  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
    this.storageSub.next('changed');
  }

  removeItem(key:any) {
    localStorage.removeItem(key);
    this.storageSub.next('changed');
  }

  logOut(cannotLog: String) {
    this.storageSub.next(cannotLog);
  }
  getEmail(){
    return localStorage.getItem("email");
  }

  
}
