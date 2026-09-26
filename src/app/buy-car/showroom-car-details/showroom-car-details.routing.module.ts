import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditShowroomCarDetailsFormComponent } from './add-edit-showroom-car-details-form/add-edit-showroom-car-details-form.component';
import { ShowroomCarDetailsComponent } from './showroom-car-details.component';



const routes: Routes = [
  { path: '', component: ShowroomCarDetailsComponent },
  { path: 'create-showroom-car-details', component: AddEditShowroomCarDetailsFormComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShowroomCarDetailsRoutingModule { }