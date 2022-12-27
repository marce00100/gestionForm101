import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UAuthService } from './uauth.service';

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class ResthttpService {

  constructor(private http: HttpClient, private authS: UAuthService) { }


  // public send(verbo: string, url: string, obj: any, fn: Function) {
  //   obj._token = this.authS.getUserAuth().token;
  //   let send = (verbo.toLowerCase() == 'post') ? $.post : $.get;
  //   send(url, obj, fn);

  // }
}
