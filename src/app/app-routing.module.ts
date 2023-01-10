import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';


import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
/** Call Guards and Services */
import { PuertaAuthGuard }     from './shared/puertaAuth.guard';
import { PuertaNivel1 }        from './shared/puertaNivel1.guard';
import { PuertaNivel2 }        from './shared/puertaNivel2.guard';

/** Call todos los componentes */
/* Public */
import { LoginComponent }       from './public/login/login.component';
import { ViewformComponent }    from './public/viewform/viewform.component';
import { HomeComponent }        from './shared/home.component';
/* Operador */
import { Form101Component }     from './oper/form101/form101.component';
import { ListaformsComponent }  from './oper/listaforms/listaforms.component';
/* Admin */
import { UsersComponent }             from './admin/usuarios/usuarios.component';
import { GestorFormsComponent }       from './admin/gestorforms/gestorforms.component';
import { GestionContenidosComponent } from './admin/gestion-contenidos/gestion-contenidos.component';


const routes: Routes = [
  
  /** rutas publicas */
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verformulario/:uid', component: ViewformComponent },

  /** rutas operador */
  { path: 'form101',         component: Form101Component,    canActivate: [PuertaAuthGuard] },
  { path: 'listaforms',      component: ListaformsComponent, canActivate: [PuertaAuthGuard] },
  { path: 'listaforms/:uid', component: ListaformsComponent, canActivate: [PuertaAuthGuard] },

  /** rutas admin */  
  { path: 'gestorforms', component: GestorFormsComponent,      canActivate: [PuertaAuthGuard, PuertaNivel1] },
  { path: 'usuarios',   component: UsersComponent,             canActivate: [PuertaAuthGuard, PuertaNivel1] },
  { path: 'contenidos', component: GestionContenidosComponent, canActivate: [PuertaAuthGuard, PuertaNivel1] },
  
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
