import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { SettingComponent } from './setting.component';
import { AddSettingComponent } from './add-setting/add-setting.component';
import { EditSettingComponent } from './edit-setting/edit-setting.component';
import { AddEditSettingFormComponent } from './add-edit-setting-form/add-edit-setting-form.component';
import { SettingRoutingModule } from './setting-routing.module';


@NgModule({
    declarations: [
        SettingComponent,
        AddSettingComponent ,
        EditSettingComponent ,
        AddEditSettingFormComponent
    ],
    exports: [SettingComponent],
    imports: [SettingRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddSettingComponent ,
        EditSettingComponent ,
        AddEditSettingFormComponent
    ]

})

export class SettingModule { }