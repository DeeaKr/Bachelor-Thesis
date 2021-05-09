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
    DialogComponent
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
    AngularFirestoreModule
    
    



  ],
  providers: [AuthServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
