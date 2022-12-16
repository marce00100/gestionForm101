import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './shared/user.service';

declare var xyzFuns: any;
declare var _: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


export class AppComponent implements OnInit {
  
  constructor(public userS: UserService, private router: Router ) {}
  
  ngOnInit(){ 
    this.userS.generaUserCtx();
  }  

  cerrarSesion(){
    this.userS.logout();
    this.router.navigate(['login']);
  }


}

interface MenuItem {
  name      : string,
  icon      : string,
  redirectTo: string,
  rol       : [number],
}

