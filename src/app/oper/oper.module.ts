import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { OperRoutingModule } from './oper-routing.module';
import { Form101Component } from './form101/form101.component';
import { OperComponent } from './oper.component';
import { ListaformsComponent } from './listaforms/listaforms.component';


@NgModule({
  declarations: [
    Form101Component,
    OperComponent,
    ListaformsComponent
  ],
  imports: [
    CommonModule,
    OperRoutingModule,
    IonicModule
  ]
})
export class OperModule { }
