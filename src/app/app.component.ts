import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UAuthService } from './shared/uauth.service';

declare var $: any;
declare var xyzFuns: any;
declare var _: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent implements OnInit {
  
  userCtx: any = {}

  constructor(public uAuth: UAuthService, private router: Router ) {}
  
  ngOnInit(){ 
    this.uAuth.getUserCtx$().subscribe(userCtx => {
      this.userCtx = userCtx;
    })
    this.uAuth.generaUserCtx();
  }  

  cerrarSesion(){
    this.uAuth.logout();
    xyzFuns.spinner(false);
    this.router.navigate(['login']);
  }


}

