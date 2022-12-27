import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import { LoginComponent } from './login/login.component';
import { ViewformComponent } from './viewform/viewform.component';


@NgModule({
  declarations: [
    LoginComponent,
    ViewformComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    IonicModule,
    FormsModule
  ]
})
export class PublicModule { }
