import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileotpComponent } from './mobileotp.component';




const routes: Routes = [
  { path: '', component: MobileotpComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileotpRoutingModule { }