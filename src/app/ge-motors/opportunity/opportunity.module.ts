import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { OpportunityComponent } from './opportunity.component';
import { AddEditOpportunityComponent } from './add-edit-opportunity/add-edit-opportunity.component';
import { OpportunityRoutingModule } from './opportunity-routing.module';
import { DesTextAreaComponent } from './des-text-area/des-text-area.component';
import { ConvertQuoteComponent } from './convert-quote/convert-quote.component';
import { TestDriveComponent } from './test-drive/test-drive.component';



@NgModule({
  declarations: [
    OpportunityComponent,
    AddEditOpportunityComponent,
    DesTextAreaComponent,
    ConvertQuoteComponent,
    TestDriveComponent
  ], exports: [OpportunityComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      OpportunityRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class OpportunityModule { }
