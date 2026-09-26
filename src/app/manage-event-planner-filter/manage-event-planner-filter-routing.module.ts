import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventPlannerFilterComponent } from './manage-event-planner-filter.component';

const routes: Routes = [
     { path: '', component: ManageEventPlannerFilterComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventPlannerFilterRoutingModule { }
