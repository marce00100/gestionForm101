import { NgModule }                        from '@angular/core';
import { BrowserModule }                   from '@angular/platform-browser';
import { FormsModule }                     from '@angular/forms';
import { RouteReuseStrategy }              from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule }                from '@angular/common/http';

/** SERVICIOS Y GUARDS */
import { AppComponent }      from './app.component';
import { AppRoutingModule }  from './app-routing.module';
import { UserService }       from './shared/user.service';
import { PuertaAuthGuard }   from './shared/puertaAuth.guard';
import { PuertaNivel1 }      from './shared/puertaNivel1.guard';
import { PuertaNivel2 }      from './shared/puertaNivel2.guard';

/** MODULOS DE COMPONENTES */
import { PublicModule }     from './public/public.module';
import { OperModule }       from './oper/oper.module';
import { AdminModule }      from './admin/admin.module';
import { HomeComponent }    from './shared/home.component';
// import { ResthttpService } from './shared/resthttp.service';

@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent  
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    FormsModule,
    PublicModule,
    OperModule,
    AdminModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppComponent,
    UserService,
    // ResthttpService,

    PuertaAuthGuard,
    PuertaNivel1,
    PuertaNivel2,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
