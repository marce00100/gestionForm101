import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaNivel1 implements CanActivate {
  constructor(
    private userS: UserService,
    private router: Router
  ) { }

  canActivate(): boolean {
    let idRol = this.userS.getIdRol();
    if (idRol > 1) {
      this.router.navigate(['home']);
      return false;
    }

    return true;
  }
  
}
