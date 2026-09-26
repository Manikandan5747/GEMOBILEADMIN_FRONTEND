import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MobileVersionComponent } from './mobile-version.component';


const routes: Routes = [
  { path: '', component: MobileVersionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileVersionRoutingModule { }