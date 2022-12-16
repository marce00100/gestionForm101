import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PuertaAuthGuard implements CanActivate {
  constructor(
    private userS: UserService,
    private router : Router
    ){}

  canActivate(): boolean  {
    if(!this.userS.isLogged()){
      this.router.navigate(['login']);
      return false;
    }

    return true;
  }
  
}
