import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
const URL: string = "http://192.168.0.157:2021";
@Injectable({
  providedIn: 'root'
})

export class UploadService {

  constructor(private http: HttpClient) { 
    
  }

  onUpload(file:File,email:any){
    const fd= new FormData();
    fd.append('image',file, file.name);
    fd.append('email',email);
    return this.http.post(`${URL}/upload`,fd);
  }
  getDisplayName(email:any){
    return this.http.get(`${URL}/displayName/?email=`+email,{responseType: 'text'});
  }
  getRobot(email:any){
    return this.http.get(`${URL}/robot/?email=`+email,{responseType: 'text'});
  }
  getTop(){
    return this.http.get(`${URL}/top10`);
  }
  
}
