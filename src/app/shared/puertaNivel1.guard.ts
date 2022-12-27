import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UAuthService } from './uauth.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaNivel1 implements CanActivate {
  constructor(
    private uAuth: UAuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    let idRol = this.uAuth.getIdRol();
    // permite rol 1
    if (idRol != 1) {
      this.router.navigate(['home']);
      return false;
    }

    return true;
  }
  
}
