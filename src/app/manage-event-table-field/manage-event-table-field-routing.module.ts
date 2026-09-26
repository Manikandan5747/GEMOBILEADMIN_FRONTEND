import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventTableFieldComponent } from './manage-event-table-field.component';

const routes: Routes = [
    { path: '', component: ManageEventTableFieldComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventTableFieldRoutingModule { }
