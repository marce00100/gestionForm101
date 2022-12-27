import { NgModule }                        from '@angular/core';
import { BrowserModule }                   from '@angular/platform-browser';
import { FormsModule }                     from '@angular/forms';
import { RouteReuseStrategy }              from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule }                from '@angular/common/http';

/** SERVICIOS Y GUARDS */
import { AppComponent }      from './app.component';
import { AppRoutingModule }  from './app-routing.module';
import { UAuthService }      from './shared/uauth.service';
import { SFormService }      from './shared/sform.service';
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
    HttpClientModule,
    FormsModule,
    
    PublicModule,
    OperModule,
    AdminModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppComponent,
    UAuthService,
    SFormService,
    // ResthttpService,

    PuertaAuthGuard,
    PuertaNivel1,
    PuertaNivel2,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
