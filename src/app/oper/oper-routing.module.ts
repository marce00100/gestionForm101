import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Form101Component } from './form101/form101.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'form', component: Form101Component },
      { path: '**', component: Form101Component },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperRoutingModule { }
