import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuotationComponent } from './quotation.component';
import { QuotePdfComponent } from './quote-pdf/quote-pdf.component';

const routes: Routes = [
  { path: '', component: QuotationComponent },
  { path: 'quotepdf', component: QuotePdfComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuotationRoutingModule { }
