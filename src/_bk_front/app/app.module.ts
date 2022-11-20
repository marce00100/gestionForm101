// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { RouteReuseStrategy } from '@angular/router';

// import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

// import { AppComponent } from './app.component';
// import { AppRoutingModule } from './app-routing.module';

// @NgModule({
//   declarations: [AppComponent],
//   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
//   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
//   bootstrap: [AppComponent],
// })
// export class AppModule {}

import { NgModule }                        from '@angular/core';
import { BrowserModule }                   from '@angular/platform-browser';
import { RouterModule, Routes }            from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent }                    from './app.component';
import { UsersComponent }                  from './admin/users/users.component';
import { IngeniosComponent }               from './admin/ingenios/ingenios.component';
import { GestorFormsComponent }            from './admin/gestorforms/gestorforms.component';
import { FormComponent }                   from './operadores/form/form.component';

import { MenuadminComponent }              from './shared/menuadmin.component';
import { MenuoperComponent }               from './shared/menuoper.component';

// declare var $:any;
// declare var _:any;

const AppRoutes: Routes = [
  { path: "", component: FormComponent },
  { path: "home", component: FormComponent },
  { path: "form", component: FormComponent },
  { path: "users", component: UsersComponent },
  { path: "ingenios", component: IngeniosComponent },
  { path: "gestorforms", component: GestorFormsComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    IngeniosComponent,
    FormComponent,
    GestorFormsComponent,
    /* shared */
    MenuadminComponent,
    MenuoperComponent

  ],
  imports: [
    BrowserModule, IonicModule.forRoot(), RouterModule.forRoot(AppRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
