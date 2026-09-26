import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { ManageEventCustomerRoutingModule } from './manage-event-customer-routing.module';


import { DemoMaterialModule } from '../demo-material-module';

// import { DesTextAreaComponent } from './des-text-area.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageEventCustomerComponent } from './manage-event-customer.component';

@NgModule({
  declarations: [
    ManageEventCustomerComponent
  ],
 
   exports: [ManageEventCustomerComponent],
     imports: [
       CommonModule,
       DemoMaterialModule,
       FormsModule,
       ReactiveFormsModule,
       ManageEventCustomerRoutingModule
     ],
     
         schemas: [
             CUSTOM_ELEMENTS_SCHEMA
         ]
         
   
})
export class ManageEventCustomerModule { }
