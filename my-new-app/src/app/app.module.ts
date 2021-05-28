import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ExamplesComponent } from './examples/examples.component';
import { AboutComponent } from './about/about.component';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LottieAnimationViewModule } from 'ng-lottie';
import { DialogComponent } from './dialog/dialog.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import{ AngularFireAuthModule} from '@angular/fire/auth'
import{AngularFireDatabaseModule} from '@angular/fire/database'
import { AuthServiceService } from './services/auth-service.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { NavbarService } from './services/navbar.service';
import { RegisterService } from './services/register.service';
import { UploadService } from './services/upload.service';
import { UtilsService } from './services/utils.service';
import { FacadeServiceService } from './services/facade-service.service';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExamplesComponent,
    AboutComponent,
    HeaderComponent,
    SidenavListComponent,
    RegisterComponent,
    LoginComponent,
    DialogComponent,
    VerifyEmailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule ,
    LottieAnimationViewModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    CommonModule
    
    



  ],
  providers: [AuthServiceService, NavbarService, RegisterService, UploadService, UtilsService, FacadeServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
