import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageModuleComponent } from './manage-module.component';

const routes: Routes = [
  { path: '', component: ManageModuleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageModuleRoutingModule { }