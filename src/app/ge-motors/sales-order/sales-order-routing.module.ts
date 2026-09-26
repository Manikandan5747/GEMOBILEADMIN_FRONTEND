import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order.component';
import { SalesorderPdfComponent } from './salesorder-pdf/salesorder-pdf.component';

const routes: Routes = [
  { path: '', component: SalesOrderComponent },
  { path: 'salesorderpdf', component: SalesorderPdfComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesOrderRoutingModule { }
