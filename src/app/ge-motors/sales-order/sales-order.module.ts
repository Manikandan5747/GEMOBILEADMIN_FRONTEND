import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { SalesOrderRoutingModule } from './sales-order-routing.module';
import { SalesOrderComponent } from './sales-order.component';
import { AddEditSalesOrderComponent } from './add-edit-sales-order/add-edit-sales-order.component';
import { SalesorderPdfComponent } from './salesorder-pdf/salesorder-pdf.component';
import { OpportunityAdvanceSearchComponent } from './opportunity-advance-search/opportunity-advance-search.component';
import { SignLinkComponent } from './sign-link/sign-link.component';




@NgModule({
  declarations: [
    SalesOrderComponent,
    AddEditSalesOrderComponent,
    SalesorderPdfComponent,
    OpportunityAdvanceSearchComponent,
    SignLinkComponent
  ], exports: [SalesOrderComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      SalesOrderRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class SalesOrderModule { }
