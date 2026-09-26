import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PortalUserComponent } from './portal-user.component';

const routes: Routes = [
  { path: '', component: PortalUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }