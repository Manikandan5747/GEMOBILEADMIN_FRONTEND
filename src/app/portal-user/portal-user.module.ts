import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PortalUserComponent } from './portal-user.component';
import { PortalRoutingModule } from './portal-user-routing.module';

@NgModule({
    declarations: [
        PortalUserComponent
    ],
    exports: [PortalUserComponent],
    imports: [PortalRoutingModule,
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

export class PortalUserModule { }