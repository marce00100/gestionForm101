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

import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent }         from './app.component';
import { UsersComponent }       from './users/users.component';
import { IngeniosComponent }    from './ingenios/ingenios.component';
import { FormComponent }        from './form/form.component';
import { GestorFormsComponent }        from './gestor-forms/gestor-forms.component';

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
    GestorFormsComponent
  ],
  imports: [
    BrowserModule, IonicModule.forRoot(), RouterModule.forRoot(AppRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
