import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAllUserComponent } from './list-all-user.component';

const routes: Routes = [
  { path: '', component: ListAllUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }