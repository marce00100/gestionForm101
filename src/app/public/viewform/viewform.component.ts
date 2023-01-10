import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SFormService } from 'src/app/shared/sform.service';
import { UAuthService } from 'src/app/shared/uauth.service';

declare var $ : any;
declare var _: any;
declare var xyzFuns: any;

@Component({
  selector: 'app-view-form-filled',
  templateUrl: './viewform.component.html',
  styleUrls: ['./viewform.component.scss'],
})
export class ViewformComponent implements OnInit {

  constructor(
    public sform: SFormService, 
    public uauth:UAuthService,
    private routeurl: ActivatedRoute) { }

  ngOnInit() {
    this.uauth.setEnteringPublicPage(true);
    let uid = this.routeurl.snapshot.paramMap.get('uid');
    $.get(`${xyzFuns.urlRestApi}/formenviado-resp`, { fluid: uid }, (resp) => {
      let formlleno = resp.data;
      this.sform.renderFormLleno("[__frm_content]", formlleno);
    })
  }

  mostrarCopiado(){
    let el = $("[__copyUrl] [__copiado]");
    el.fadeIn(400);
    setTimeout(() => {
      el.fadeOut(300);
    }, 2000);
  }



}
