import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPrivilegeComponent } from './user-privilege.component';


const routes: Routes = [
  { path: '', component: UserPrivilegeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivilegeRoutingModule { }