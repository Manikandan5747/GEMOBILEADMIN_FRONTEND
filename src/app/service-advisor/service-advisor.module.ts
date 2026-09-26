import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ServiceAdvisorComponent } from './service-advisor.component';
import { ServiceAdvisorRoutingModule } from './service-advisor.routing.module';
import { EditServiseAdvisorComponent } from './edit-servise-advisor/edit-servise-advisor.component';
import { AnnualLeaveComponent } from './annual-leave/annual-leave.component';


@NgModule({
    declarations: [
        ServiceAdvisorComponent,
        EditServiseAdvisorComponent,
        AnnualLeaveComponent
    ],
    exports: [ServiceAdvisorComponent],
    imports: [
        ServiceAdvisorRoutingModule,
        CommonModule,MatSelectFilterModule,
        DemoMaterialModule,
        FormsModule,
        
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        EditServiseAdvisorComponent
    ],
  

})


export class  ServiceAdvisorModule { }