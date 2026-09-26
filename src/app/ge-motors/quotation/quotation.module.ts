import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { QuotationRoutingModule } from './quotation-routing.module';
import { QuotationComponent } from './quotation.component';
import { AddEditQuotationComponent } from './add-edit-quotation/add-edit-quotation.component';
import { QuotePdfComponent } from './quote-pdf/quote-pdf.component';



@NgModule({
  declarations: [
    QuotationComponent,
    AddEditQuotationComponent,
    QuotePdfComponent
  ], exports: [QuotationComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      QuotationRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class QuotationModule { }
