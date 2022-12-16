import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'login', component: LoginComponent},
      { path: '**', redirectTo: 'login'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FormsModule],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
