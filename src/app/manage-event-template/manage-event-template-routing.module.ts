import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventTemplateComponent } from './manage-event-template.component';

const routes: Routes = [
   { path: '', component: ManageEventTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventTemplateRoutingModule { }
