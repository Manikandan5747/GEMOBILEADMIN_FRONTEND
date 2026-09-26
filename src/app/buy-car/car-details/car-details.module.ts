import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CarDetailsComponent } from './car-details.component';
import { CarDetailsRoutingModule } from './car-details.routing.module';
import { AddEditCarDetailsFormComponent } from './add-edit-car-details-form/add-edit-car-details-form.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ViewCarImgComponent } from './view-car-img/view-car-img.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { RouterModule } from '@angular/router';
import { ExpenseDetailComponent } from './expense-detail/expense-detail.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';
import { AdvancePaymentModule } from 'src/app/ge-motors/advance-payment/advance-payment.module';
import { AdvanceComponent } from './advance/advance.component';
import { ConsignmentdirComponent } from './consignmentdir/consignmentdir.component';
import { ConsignmentModule } from 'src/app/ge-motors/consignment/consignment.module';
import { RequestInspectionReportRedirComponent } from './request-inspection-report-redir/request-inspection-report-redir.component';
import { RequestInspectionReportModule } from 'src/app/ge-motors/request-inspection-report/request-inspection-report.module';

@NgModule({
    declarations: [
        CarDetailsComponent,
        AddEditCarDetailsFormComponent,
        ViewCarImgComponent,
        ExpenseDetailComponent,
        ExpenseFormComponent,
        AddExpenseComponent,
        EditExpenseComponent,
        AdvanceComponent,
        ConsignmentdirComponent,
        RequestInspectionReportRedirComponent
        
    ],
    exports: [CarDetailsComponent],
    imports: [CarDetailsRoutingModule,
        CommonModule,NgxDropzoneModule,RouterModule,
        DemoMaterialModule,
        FormsModule, AdvancePaymentModule,ConsignmentModule,
        RequestInspectionReportModule,
        ReactiveFormsModule,
        MatSelectFilterModule,
        NgImageSliderModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],providers: [],
})

export class CarDetailsModule { }