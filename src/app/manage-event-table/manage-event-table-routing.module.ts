import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventTableComponent } from './manage-event-table.component';

const routes: Routes = [

      { path: '', component: ManageEventTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventTableRoutingModule { }
