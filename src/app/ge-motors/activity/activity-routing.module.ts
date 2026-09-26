import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivityComponent } from './activity.component';
import { AddEditActivityComponent } from './add-edit-activity/add-edit-activity.component';


const routes: Routes = [
  { path: '', component: ActivityComponent },
  { path: 'add-edit-activity', component: AddEditActivityComponent },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActivityRoutingModule { }
