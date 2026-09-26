import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageModuleComponent } from './manage-module.component';
import { AddManageModuleComponent } from './add-manage-module/add-manage-module.component';
import { AddEditManageModuleFormComponent } from './add-edit-manage-module-form/add-edit-manage-module-form.component';
import { EditManageModuleComponent } from './edit-manage-module/edit-manage-module.component';
import { ManageModuleRoutingModule } from './manage-module.routing.module';
import { DemoMaterialModule } from '../demo-material-module';

@NgModule({
    declarations: [
        ManageModuleComponent,
         AddManageModuleComponent,
         AddEditManageModuleFormComponent,
         EditManageModuleComponent,
    ],
    exports: [ManageModuleComponent],
    imports: [
         ManageModuleRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddManageModuleComponent,
        AddEditManageModuleFormComponent,
         EditManageModuleComponent
    ]

})

export class ManageModuleModule { }