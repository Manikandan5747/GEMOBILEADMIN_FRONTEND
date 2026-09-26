import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarownerTypeComponent } from './carowner-type.component';

const routes: Routes = [{ path: '', component: CarownerTypeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarownerTypeConfigRoutingModule { }
