import { Component, OnInit } from '@angular/core';

import { UAuthService }        from '../../shared/uauth.service';
import { AppComponent }      from '../../app.component';
import { Router }            from '@angular/router';
import { HttpClient }        from '@angular/common/http';

declare var $: any;
declare var _: any;
declare var xyzFuns: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AppComponent, ],
})

export class LoginComponent implements OnInit {
  username:string = '';
  password:string = '';
  error_email:boolean = false;
  error_password:boolean = false;

  constructor(
    private uAuth: UAuthService,
    private router: Router,
    private appComponent: AppComponent,
    private http : HttpClient,
  ) { }

  ngOnInit(): void {
    if (this.uAuth.isLogged()) {
        this.router.navigate(['home']);    
      }
  }

  login(){
    $("[__error_msg]").hide();
    let username = this.username.trim().toLowerCase();
    let password = this.password;
    this.error_email = (username == '');
    this.error_password = (password == '');
    if(this.error_email || this.error_password){
      this.mostrarError(' ** Los campos son requeridos.');
      return;
    }

    let user = {
      username: username,
      password: password
    }
    
    //$("[__output]").append(`<p>Envio a ${xyzFuns.urlRestApi}/auth -> ${user.email}  ${user.password}</P>`);
    
    xyzFuns.spinner();
    this.http.post<any>(`${xyzFuns.urlRestApi}/auth`, user).subscribe({
      next: res => {
        // console.log("  Success :", res.msg);
        // $("[__output]").append(`<p>Todo Success : ${res.msg} </P>`);
        if (res.status == 'error') {
          this.mostrarError(' **' + res.msg);
          xyzFuns.spinner(false);
          return;
        }

        let dt = res.data;
        this.uAuth.login({
          token: dt.token,
          token2: dt.token2,
          user: dt.user
        });
        /** Se subscribe el observable de ctxUser */
        this.appComponent.ngOnInit();
        
        xyzFuns.spinner(false);
        // this.appComponent.colocaUsername();
        this.router.navigate(['/home']);
      },
      error: error => {
          xyzFuns.spinner(false);
          $("[__output]").append(`<p>Error post: ${error} </P>`);
          console.log(arguments);
          console.log("Error post: " + error);
      }
    })

    // $.ajax({
    //   type:     "post",
    //   data:     user,
    //   cache:    false,
    //   url:      `${xyzFuns.urlRestApi}/auth`,
    //   dataType: "text",
    //   success: function (res) {
    //     console.log(" Bieeen :", res.msg);
    //     $("[__output]").append(`<p>Error en el post: ${res.msg} </P>`);
    //   },
    //   error: function (request, error) {
    //       $("[__output]").append(`<p>Error en el post: ${error} </P>`);
    //       console.log(arguments);
    //       console.log(" Can't do because: " + error);
    //   },
    // });
    
    //   $.post(`${xyzFuns.urlRestApi}/auth`, user, (res)  => {
    //     if(res.status == 'error'){
    //       this.mostrarError(' **' + res.msg);
    //       xyzFuns.spinner(false);
    //       return;
    //     }
    //     localStorage.setItem('auth_token', res.data.token);
    //     localStorage.setItem('auth_token2', res.data.token2);
    //     localStorage.setItem('uid_uid', res.data.user.id);      

    //   xyzFuns.spinner(false);
    //   this.appComponent.verificarSesion();
    //   this.router.navigate(['/home']);
    // }).fail(function(e){
    //   $("[__output]").append('<p>Error en el post</P>');
    // })
  }

  mostrarError(msg){
    let html = /*html*/`${msg}`;
    $("[__error_msg]").html(html).show();
  }
}
