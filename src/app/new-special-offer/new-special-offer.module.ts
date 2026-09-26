import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NewSpecialOfferComponent } from './new-special-offer.component';
import { AddNewSpecialOfferComponent } from './add-new-special-offer/add-new-special-offer.component';
import { EditNewSpecialOfferComponent } from './edit-new-special-offer/edit-new-special-offer.component';
import { NewSpecialOfferRoutingModule } from './new-special-offer.routes';
// import { MatMomentDateModule } from '@angular/material-moment-adapter';


@NgModule({
    declarations: [
        NewSpecialOfferComponent,
        AddNewSpecialOfferComponent,
        EditNewSpecialOfferComponent
       
    ],
    exports: [NewSpecialOfferComponent],
    imports: [
        NewSpecialOfferRoutingModule,
        CommonModule,MatSelectFilterModule,
        DemoMaterialModule,
        // MatMomentDateModule,
        FormsModule,
        
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        
    ],
  

})


export class  NewSpecialOfferModule { }