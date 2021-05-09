import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ExamplesComponent } from './examples/examples.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from "./shared/auth.guard";
import { VerifyEmailComponent } from './verify-email/verify-email.component';
const routes: Routes = [
  {path: 'home', component:HomeComponent, canActivate: [AuthGuard] },
  {path:'examples', component:ExamplesComponent, canActivate: [AuthGuard] },
  {path:'about', component:AboutComponent, canActivate: [AuthGuard] },
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  { path: 'verify-email-address', component: VerifyEmailComponent },
  {path:'',redirectTo:'/login',pathMatch:'full'}
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
