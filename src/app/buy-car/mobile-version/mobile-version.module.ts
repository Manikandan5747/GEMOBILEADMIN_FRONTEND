import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MobileVersionComponent } from './mobile-version.component';
import { MobileVersionRoutingModule } from './mobile-version.routing.module';
import { EditMobileVersionComponent } from './edit-mobile-version/edit-mobile-version.component';
import { AddMobileVersionComponent } from './add-mobile-version/add-mobile-version.component';
import { AddEditMobileVersionFormComponent } from './add-edit-mobile-version-form/add-edit-mobile-version-form.component';


@NgModule({
    declarations: [
        MobileVersionComponent,
        EditMobileVersionComponent,
        AddMobileVersionComponent,
        AddEditMobileVersionFormComponent        
    ],
    exports: [MobileVersionComponent],
    imports: [MobileVersionRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        EditMobileVersionComponent,
        AddMobileVersionComponent,
        AddEditMobileVersionFormComponent     
    ]

})


export class MobileVersionModule { }