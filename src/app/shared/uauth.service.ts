import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var $: any;
declare var _: any;
declare var xyzFuns: any;

@Injectable({
  providedIn: 'root'
})
export class UAuthService {

  private keyTk  = 'forge_token';
  private keyTk2 = 'forge_token2';
  private keyU = 'current';
  
  private itemsMenu: any[] = [
    { name: "Seguimiento",      redirectTo: "seguimientoforms",    icon: "glyphicons glyphicons-riflescope fa-lg ", roles: [1] },
    { name: "Adm. Usuarios",    redirectTo: "usuarios",            icon: "glyphicons glyphicons-group fa-lg ",      roles: [1] },
    { name: "Adm. Contenidos",  redirectTo: "gestion-contenidos",  icon: "fa fa-paperclip fa-lg ",                  roles: [1] },
    { name: "Editor de Form.",  redirectTo: "gestorforms",         icon: "glyphicons glyphicons-magic fa-lg ",      roles: [1] },
    { name: "Historial envíos", redirectTo: "listaforms",          icon: "glyphicons glyphicons-cargo fa-lg ",      roles: [3] },
    { name: "Formulario 101",   redirectTo: "form101",             icon: "glyphicons glyphicons-notes_2 fa-lg ",    roles: [3] },
    { name: "Noticias",         redirectTo: "contenidos",          icon: "fa fa-bullhorn fa-lg ",                   roles: [3] },
  ];

  private userCtx: any = {};
  
  private userCtx$: Subject<any>;

  constructor() {
    this.userCtx$ = new Subject();
  }

  getUserCtx$() : Observable<any[]>{
    return this.userCtx$.asObservable();
  }

  /**
   * Al IniciarSesión se crea el objeto userAuth y se genera el menu
   * @param obj Objeto de inicio de sesion { token: string, token2: string, user?: objUserData }
   */
  public login(obj: any) {
    if (obj.token) {
      localStorage.setItem(this.keyTk, obj.token);
      localStorage.setItem(this.keyTk2, obj.token2);
      localStorage.setItem(this.keyU, obj.user.username);
      return;
    }
  }

  /**
   * Genera el Menu de usuario , y el objetode usuario userAuth ,sino ambos son vacios
   */
  public generaUserCtx() {
    let token = localStorage.getItem(this.keyTk);
    let token2 = localStorage.getItem(this.keyTk2);
    if (token !== null && token2 !== null) {
      let idRol = this.getIdRol();
      this.userCtx = {
        userItemsMenu: _.filter(this.itemsMenu, item => item.roles.includes(idRol)),
        username: this.getUsername(),
        islogged: true,
        enteringPublicPage: false
      }
      this.userCtx$.next(this.userCtx);
    }
    else
      this.logout();
  }

  /**
   * Cerrar sesion, elimina variables almacenadas
   */
  public logout() {
    localStorage.removeItem(this.keyTk);
    localStorage.removeItem(this.keyTk2);
    localStorage.removeItem(this.keyU);
    this.userCtx = {};
    this.userCtx$.next(this.userCtx);
  }

  /**
   * Si esta ingresando a una pagina publica ,para no mostrar el Menu
   * @param isPublic Lapagina es publica boolean
   */
  public setEnteringPublicPage(isPublic: boolean = true){
    this.userCtx.enteringPublicPage = isPublic;
    this.userCtx$.next(this.userCtx);
  }
  
  /**
   * Verifica si esta Logueado
   * @returns Bool true or false
   */
  public isLogged(): boolean {
    return (localStorage.getItem(this.keyTk) != null );
  }

  /**
   * Obtiene rl idRol 
   * @returns id_rol
   */
  public getIdRol(){
    let tk2 = localStorage.getItem(this.keyTk2);
    let idRol = tk2 ? parseInt(tk2.slice(8, 9)) : -99;
    return idRol;
  }

  /**
   * Retorna el Nombre de usuario
   * @returns username
   */
  public getUsername(){
    return localStorage.getItem(this.keyU);
  }

  /**
   * Retorna el Token
   * @returns token
   */
  public getToken() {
    return localStorage.getItem(this.keyTk);
  }

  /**
   * Agrega el token al objeto que se va a enviar request 
   * @param obj Object to Send
   * @returns Object with parameter that contains token
   */
  public addToken(obj:any){
    obj._token = this.getToken();
    return obj;
  }
  
}

/**
 * Interface TIpo AUTH, con datos básicos de la autenticación
 */
// interface Auth {
//   token: string,
//   idRol: number,
//   username?: string,
//   email?: string,
// }

// interface ItemMenu{
//   name: string,   
//   redirectTo: string,     
//   icon: string, 
//   roles: number[],
// }