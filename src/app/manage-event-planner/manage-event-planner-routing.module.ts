import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventPlannerComponent } from './manage-event-planner.component';

const routes: Routes = [
   { path: '', component: ManageEventPlannerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventPlannerRoutingModule { }
