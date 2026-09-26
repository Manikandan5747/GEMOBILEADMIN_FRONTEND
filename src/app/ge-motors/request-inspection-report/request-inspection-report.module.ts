import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { RequestInspectionReportComponent } from './request-inspection-report.component';
import { AddRequestInspectionReportComponent } from './add-request-inspection-report/add-request-inspection-report.component';
import { RequestInspectionReportRoutingModule } from './request-inspection-report-routing.module';



@NgModule({
  declarations: [
    RequestInspectionReportComponent,
    AddRequestInspectionReportComponent,
  ], exports: [RequestInspectionReportComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      RequestInspectionReportRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class RequestInspectionReportModule { }
