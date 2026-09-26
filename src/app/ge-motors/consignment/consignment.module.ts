import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ConsignmentComponent } from './consignment.component';
import { ConsignmentRoutingModule } from './consignment-routing.module';
import { AddConsignmentComponent } from './add-consignment/add-consignment.component';
import { ConsignmentFormComponent } from './consignment-form/consignment-form.component';
import { EditConsignmentComponent } from './edit-consignment/edit-consignment.component';
import { ConsignmentPdfComponent } from './consignment-pdf/consignment-pdf.component';
import { SignLinkComponent } from './sign-link/sign-link.component';


@NgModule({
  declarations: [
    ConsignmentComponent,
    AddConsignmentComponent,
    ConsignmentFormComponent,
    EditConsignmentComponent,
    ConsignmentPdfComponent,
    SignLinkComponent
    
  ], exports: [ConsignmentComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ConsignmentRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ConsignmentModule { }
