import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

import { UsersComponent } from './usuarios/usuarios.component';
import { GestorFormsComponent } from './gestorforms/gestorforms.component';

@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    GestorFormsComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    IonicModule,
    RouterModule
  ]
})
export class AdminModule { }
