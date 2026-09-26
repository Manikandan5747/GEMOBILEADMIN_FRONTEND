import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventCustomerComponent } from './manage-event-customer.component';

const routes: Routes = [
    { path: '', component: ManageEventCustomerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventCustomerRoutingModule { }
