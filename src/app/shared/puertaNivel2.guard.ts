import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UAuthService } from './uauth.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaNivel2 implements CanActivate {
  constructor(
    private uAuth: UAuthService,
    private router : Router
    ){}

  canActivate(): boolean {
    let idRol = this.uAuth.getIdRol();
    /** permite roles 1 y 2 */
    if (idRol != 2 && idRol != 1) {
      this.router.navigate(['home']);
      return false;
    }

    return true;
  }
  
}
