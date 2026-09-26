import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { BrandComponent } from './brand.component';
import { BrandRoutingModule } from './brand-routing.module';
import { AddBrandComponent } from './add-brand/add-brand.component';
import { EditBrandComponent } from './edit-brand/edit-brand.component';
import { AddEditBrandFormComponent } from './add-edit-brand-form/add-edit-brand-form.component';
import { ImportBrandComponent } from './import-brand/import-brand.component';

@NgModule({
    declarations: [
        BrandComponent,
        AddBrandComponent,
        EditBrandComponent,
        AddEditBrandFormComponent,
        ImportBrandComponent
    ],
    exports: [BrandComponent],
    imports: [BrandRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [
        AddBrandComponent,
        EditBrandComponent,
        AddEditBrandFormComponent
    ]

})

export class BrandModule { }