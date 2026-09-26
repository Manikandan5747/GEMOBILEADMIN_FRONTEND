import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { SpecialOfferComponent } from './special-offer.component';
import { SpecialOfferRoutingModule } from './special-offer-routing.module';
import { AddEditSpecialOfferFormComponent } from './add-edit-special-offer-form/add-edit-special-offer-form.component';
import { ViewImgComponent } from './view-img/view-img.component';


@NgModule({
    declarations: [
        SpecialOfferComponent,
        AddEditSpecialOfferFormComponent,
        ViewImgComponent,
    ],
    exports: [SpecialOfferComponent],
    imports: [
        SpecialOfferRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddEditSpecialOfferFormComponent,
    ]

})




export class SpecialOfferModule { }