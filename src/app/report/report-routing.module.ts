import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportComponent } from './report/report.component';
// import { ReportComponent } from './report/report.component';
import { ReportPaginationComponent } from './reportPagination/report-pagination/report-pagination.component';
import { ReportTableComponent } from './reportTable/report-table/report-table.component';

const routes: Routes = [
  { path: '', component: ReportPaginationComponent },
  { path: 'carreport', component: ReportComponent },

  { path: ':reportName', component: ReportTableComponent }, // Add this route for report details
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }