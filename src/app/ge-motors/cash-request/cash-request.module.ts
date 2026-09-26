import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CashRequestComponent } from './cash-request.component';
import { CashRequestRoutingModule } from './cash-request-routing.module';
import { AddEditCashRequestComponent } from './add-edit-cash-request/add-edit-cash-request.component';
import { PriceFormatPipe } from 'src/app/service/form-validation/price-format.pipe';
import { PriceInputDirective } from 'src/app/service/form-validation/price-input.directive';


@NgModule({
  declarations: [
    CashRequestComponent,
    AddEditCashRequestComponent,
 
  ], exports: [CashRequestComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      CashRequestRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CashRequestModule { }
