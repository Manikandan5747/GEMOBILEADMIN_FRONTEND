import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VehicleAppraisalComponent } from './vehicle-appraisal.component';
import { ViewVehicleDetailsComponent } from './view-vehicle-details/view-vehicle-details.component';


const routes: Routes = [
  { path: '', component: VehicleAppraisalComponent },
  { path: 'view-vehicle', component: ViewVehicleDetailsComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VehicleAppraisalRoutingModule { }