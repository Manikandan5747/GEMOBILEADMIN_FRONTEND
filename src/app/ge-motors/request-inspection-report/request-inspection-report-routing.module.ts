import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestInspectionReportComponent } from './request-inspection-report.component';


const routes: Routes = [
  { path: '', component: RequestInspectionReportComponent },  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequestInspectionReportRoutingModule { }
