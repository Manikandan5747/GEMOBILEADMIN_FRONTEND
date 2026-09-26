import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageCustomerComponent } from './manage-customer.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AddEditCustomerFormComponent } from './add-edit-customer-form/add-edit-customer-form.component';
import { EditCustomerComponent } from './edit-customer/edit-customer.component';
import { CustomerRoutingModule } from './manage-customer-routing.module';
import { DemoMaterialModule } from '../demo-material-module';
import { DesTextAreaComponent } from './des-text-area/des-text-area.component';

@NgModule({
    declarations: [
        ManageCustomerComponent,
        AddCustomerComponent,
        AddEditCustomerFormComponent,
        EditCustomerComponent,
        DesTextAreaComponent
     
    ],
    exports: [ManageCustomerComponent],
    imports: [CustomerRoutingModule,
        CommonModule,
        // HeaderModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddCustomerComponent,
        AddEditCustomerFormComponent,
        EditCustomerComponent
    ]

})




export class ManageCustomerModule { }