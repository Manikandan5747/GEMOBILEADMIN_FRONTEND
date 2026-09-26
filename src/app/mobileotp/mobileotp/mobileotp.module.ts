import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MobileotpComponent } from './mobileotp.component';
import { MobileotpRoutingModule } from './mobileotp-routing.module';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@NgModule({
    declarations: [
        MobileotpComponent
    ],
    exports: [MobileotpComponent],
    imports: [
        MobileotpRoutingModule,
        CommonModule,
        FormsModule,
        DemoMaterialModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
      //  AddNotificationComponent,
    ]

})




export class MobileotpModule { }