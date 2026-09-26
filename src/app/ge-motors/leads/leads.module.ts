import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { LeadsComponent } from './leads.component';
import { LeadsRoutingModule } from './leads-routing.module';
import { AddEditLeadsComponent } from './add-edit-leads/add-edit-leads.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ConvertOpportunityComponent } from './convert-opportunity/convert-opportunity.component';


@NgModule({
  declarations: [
    LeadsComponent,
    AddEditLeadsComponent,
    ConvertOpportunityComponent
  ], exports: [LeadsComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,NgxDropzoneModule,
      FormsModule,
      ReactiveFormsModule,
      LeadsRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class LeadsModule { }
