import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { GestorFormsComponent } from './gestorforms/gestorforms.component';
import { UsersComponent } from './usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // { path: "admin", component: AdminComponent },
      { path: "users", component: UsersComponent },
      { path: "gestorforms", component: GestorFormsComponent },
      { path: "**", redirectTo: 'users'},
    ],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
