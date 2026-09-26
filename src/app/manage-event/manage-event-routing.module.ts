import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventComponent } from './manage-event.component';

const routes: Routes = [

    { path: '', component: ManageEventComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventRoutingModule { }
