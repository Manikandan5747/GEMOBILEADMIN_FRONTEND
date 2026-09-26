import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RentCarComponent } from './rent-car.component';
import { RentCarFormComponent } from './rent-car-form/rent-car-form.component';



const routes: Routes = [
  { path: '', component: RentCarComponent },
  { path: 'add-edit-rentcar', component: RentCarFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RentCarRoutingModule { }