import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule }  from '@ionic/angular';

import { AdminRoutingModule } from './admin-routing.module';
import { RouterModule }       from '@angular/router';

import { AdminComponent }             from './admin.component';
import { UsersComponent }             from './usuarios/usuarios.component';
import { GestorFormsComponent }       from './gestorforms/gestorforms.component';
import { GestionContenidosComponent } from './gestion-contenidos/gestion-contenidos.component';
import { DatosComponent }             from './datos/datos.component';

@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    GestorFormsComponent,
    GestionContenidosComponent,
    DatosComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    IonicModule,
    RouterModule
  ]
})
export class AdminModule { }
