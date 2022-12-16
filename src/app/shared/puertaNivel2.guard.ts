import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaNivel2 implements CanActivate {
  constructor(
    private userS: UserService,
    private router : Router
    ){}

  canActivate(): boolean {
    let idRol = this.userS.getIdRol();
    /** permite roles 1 y 2 */ 
    if(idRol <= 2)
      return true;

    this.router.navigate(['home']);
    return false;
    

  }
  
}
