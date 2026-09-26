import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report/report.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ReportPaginationComponent } from './reportPagination/report-pagination/report-pagination.component';
import { ReportTableComponent } from './reportTable/report-table/report-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { TableModule } from 'primeng/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterModalComponent } from './filter-modal/filter-modal.component';

@NgModule({
    declarations: [
        ReportComponent,
        ReportPaginationComponent,
        ReportTableComponent,FilterModalComponent
    ],
    exports: [ReportComponent],
    imports: [  
        MatSelectFilterModule,MatProgressSpinnerModule ,
        ReportRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatSortModule,
        TableModule,
        MatPaginatorModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    

})




export class ReportModule { }