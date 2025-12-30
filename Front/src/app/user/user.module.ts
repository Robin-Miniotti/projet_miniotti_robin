import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { LoginScreenComponent } from '../login-screen/login-screen.component';


const routes = [
  { path: '', component: LoginScreenComponent }  
];  

@NgModule({  
  imports: [
    CommonModule,
    LoginScreenComponent,
    RouterModule.forChild(routes)
  ]
})
export class UserModule { }
