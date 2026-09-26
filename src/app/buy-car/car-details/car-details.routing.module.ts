import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddEditCarDetailsFormComponent } from './add-edit-car-details-form/add-edit-car-details-form.component';
import { CarDetailsComponent } from './car-details.component';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { AdvanceComponent } from './advance/advance.component';
import { ConsignmentdirComponent } from './consignmentdir/consignmentdir.component';
import { RequestInspectionReportRedirComponent } from './request-inspection-report-redir/request-inspection-report-redir.component';

const routes: Routes = [
  { path: '', component: CarDetailsComponent },
  { path: 'add-edit-car', component: AddEditCarDetailsFormComponent },
  { path: 'expense-detail', component: ExpenseDetailComponent },
  { path: 'advance-payment', component: AdvanceComponent },
  { path: 'consignment', component: ConsignmentdirComponent },
  { path: 'request-inspection-report', component: RequestInspectionReportRedirComponent },

  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarDetailsRoutingModule { }