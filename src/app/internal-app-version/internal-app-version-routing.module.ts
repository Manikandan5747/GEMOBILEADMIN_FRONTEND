import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InternalAppVersionComponent } from './internal-app-version.component';

const routes: Routes = [
  {path:'', component: InternalAppVersionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalAppVersionRoutingModule { }
