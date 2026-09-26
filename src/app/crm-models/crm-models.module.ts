import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CrmModelsComponent } from './crm-models.component';

import { CrmModelsRoutingModule } from './crm-models-routing.module';
import { EditCrmModelsComponent } from './edit-crm-models/edit-crm-models.component';



@NgModule({
    declarations: [
        CrmModelsComponent,
        EditCrmModelsComponent,
    ],
    exports: [CrmModelsComponent],
    imports: [
        CrmModelsRoutingModule,
        CommonModule,MatSelectFilterModule,
        DemoMaterialModule,
        FormsModule,
        
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        EditCrmModelsComponent
    ],
  

})

export class CrmModelsModule { }
