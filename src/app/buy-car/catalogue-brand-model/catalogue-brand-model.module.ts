import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CatalogueBrandModelComponent } from './catalogue-brand-model.component';
import { CatalogueBrandModelRoutingModule } from './catalogue-brand-model.routing.module';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
    declarations: [
        CatalogueBrandModelComponent          
    ],
    exports: [CatalogueBrandModelComponent],
    imports: [CatalogueBrandModelRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectFilterModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
       
    ]

})




export class CatalogueBrandModelModule { }