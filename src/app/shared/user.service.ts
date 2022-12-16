import { Injectable } from '@angular/core';

declare var _: any;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userAuth: Auth = null

  private userItemsMenu: any = [];

  private itemsMenu: any = [
    { name: "Editor de Form.",  redirectTo: "gestorforms", icon: "glyphicons glyphicons-magic fa-lg ", roles: [1] },
    { name: "Adm. Usuarios",    redirectTo: "usuarios",    icon: "glyphicons glyphicons-group fa-lg ", roles: [1] },
    { name: "Historial envíos", redirectTo: "listaforms",  icon: "glyphicons glyphicons-cargo fa-lg ", roles: [3] },
    { name: "Formulario 101",   redirectTo: "form101",     icon: "glyphicons glyphicons-notes_2 fa-lg ", roles: [3] },
  ];

  constructor() { }

  /**
   * Al IniciarSesión se crea el objeto userAuth y se genera el menu
   * @param obj Objeto de inicio de sesion { token: string, token2: string, user?: objUserData }
   */
  public login(obj: any) {
    if (obj.token) {
      localStorage.setItem('auth_token', obj.token);
      localStorage.setItem('auth_token2', obj.token2);
      this.generaUserCtx();
    }
  }

  /**
   * Cerra secion,elimina variables almacenadas
   */
  public logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_token2');
    this.userItemsMenu = [];
    this.userAuth = null
  }

  /**
   * Verifica si esta Loggeado  
   * */
  public isLogged(): boolean {
    return (this.userAuth !== null);
  }

  /**
   * Genera el Menu de usuario , y el objetode usuario userAuth ,sino ambos son vacios
   */
  public generaUserCtx(){
    let token  = localStorage.getItem('auth_token');
    let token2 = localStorage.getItem('auth_token2');
    if (token !== null && token2 !== null){
      let ir = this.getIdRol(); 
      this.userAuth = { token: token, idRol: ir, };
      this.userItemsMenu = _.filter(this.itemsMenu, item => item.roles.includes(ir));
    }
    else
      this.logout();
  }

  /**
   * @returns userAUTH 
   */
  public getUserAuth(){
    return this.userAuth;
  }

  /**
   * Obtiene el Menu configurado para un ROL 
   * @returns menu
   */
  public getUserMenu(): [any] {
    if (this.isLogged && this.userItemsMenu.length > 0)
      return this.userItemsMenu;

    this.generaUserCtx();
    return this.userItemsMenu;
  };

  /**
   * Obtiene rl idRol 
   * @returns id_rol
   */
  public getIdRol(){
    let tk2 = localStorage.getItem('auth_token2');
    let idRol = tk2 ? parseInt(tk2.slice(8, 9)) : -99;
    return idRol;
  }




}

/**
 * Interface TIpo AUTH, con datos básicos de la autenticación
 */
interface Auth {
  token: string,
  idRol: number,
  username?: string,
  email?: string,
}