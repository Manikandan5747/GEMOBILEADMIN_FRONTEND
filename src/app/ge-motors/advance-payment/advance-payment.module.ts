import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AdvancePaymentComponent } from './advance-payment.component';
import { AdvancePaymentRoutingModule } from './advance-payment-routing.module';
import { AddAdvancePaymentComponent } from './add-advance-payment/add-advance-payment.component';
import { AdvancePaymentFormComponent } from './advance-payment-form/advance-payment-form.component';
import { EditAdvancePaymentComponent } from './edit-advance-payment/edit-advance-payment.component';
import { ReceiptVoucherComponent } from './receipt-voucher/receipt-voucher.component';



@NgModule({
  declarations: [
    AdvancePaymentComponent,
    AddAdvancePaymentComponent,
    AdvancePaymentFormComponent,
    EditAdvancePaymentComponent,
    ReceiptVoucherComponent
  ], exports: [AdvancePaymentComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      AdvancePaymentRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AdvancePaymentModule { }
