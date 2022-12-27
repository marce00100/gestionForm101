import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ListaformsComponent }  from './oper/listaforms/listaforms.component';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
/** Call Guards and Services */
import { PuertaAuthGuard }     from './shared/puertaAuth.guard';
import { PuertaNivel1 }        from './shared/puertaNivel1.guard';
import { PuertaNivel2 }        from './shared/puertaNivel2.guard';
/** Call todos los componentes */
import { LoginComponent }       from './public/login/login.component';
import { ViewformComponent }    from './public/viewform/viewform.component';
import { HomeComponent }        from './shared/home.component';
import { Form101Component }     from './oper/form101/form101.component';
import { UsersComponent }       from './admin/usuarios/usuarios.component';
import { GestorFormsComponent } from './admin/gestorforms/gestorforms.component';


const routes: Routes = [
  /** rutas publicas */
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'viewform', component: ViewformComponent },

  /** rutas admin */  
  { path: 'gestorforms', component: GestorFormsComponent,  canActivate: [PuertaAuthGuard, PuertaNivel1] },
  { path: 'usuarios', component: UsersComponent, canActivate: [PuertaAuthGuard, PuertaNivel1] },

  /** rutas operador */
  { path: 'form101', component: Form101Component, canActivate: [PuertaAuthGuard] },
  { path: 'listaforms', component: ListaformsComponent, canActivate: [PuertaAuthGuard] },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
