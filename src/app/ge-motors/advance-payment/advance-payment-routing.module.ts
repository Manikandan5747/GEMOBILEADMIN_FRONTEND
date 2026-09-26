import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancePaymentComponent } from './advance-payment.component';
// import { ReceiptVoucherComponent } from './receipt-voucher/receipt-voucher.component';

const routes: Routes = [
  { path: '', component: AdvancePaymentComponent },
  // { path: 'receipt-voucher', component: ReceiptVoucherComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvancePaymentRoutingModule { }
