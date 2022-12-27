import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UAuthService } from './uauth.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaAuthGuard implements CanActivate {
  constructor(
    private uAuth: UAuthService,
    private router : Router
    ){}

  canActivate(): boolean  {
    if(!this.uAuth.isLogged()){
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
  
}
