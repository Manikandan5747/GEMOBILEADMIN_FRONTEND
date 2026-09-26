import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventQueryComponent } from './manage-event-query.component';

const routes: Routes = [
   { path: '', component: ManageEventQueryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventQueryRoutingModule { }
