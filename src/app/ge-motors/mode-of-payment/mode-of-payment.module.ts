import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ModeOfPaymentComponent } from './mode-of-payment.component';
import { ModeOfPaymentModule } from './mode-of-payment-routing.module';
import { AddEditModeOfPaymentFormComponent } from './add-edit-mode-of-payment-form/add-edit-mode-of-payment-form.component';
import { AddModeOfPaymentComponent } from './add-mode-of-payment/add-mode-of-payment.component';
import { EditModeOfPaymentComponent } from './edit-mode-of-payment/edit-mode-of-payment.component';



@NgModule({
  declarations: [
    ModeOfPaymentComponent,
    AddEditModeOfPaymentFormComponent,
    AddModeOfPaymentComponent,
    EditModeOfPaymentComponent,
  ], exports: [ModeOfPaymentComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ModeOfPaymentModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ModeofPaymentModule { }
