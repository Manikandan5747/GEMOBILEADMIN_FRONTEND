import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeOfPaymentComponent } from './mode-of-payment.component';

const routes: Routes = [{ path: '', component: ModeOfPaymentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeOfPaymentModule { }
