import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { UserRoleComponent } from './user-role.component';
import { UserRoleRoutingModule } from './user-role.routing.module';
import { AddEditUserRoleFormComponent } from './add-edit-user-role-form/add-edit-user-role-form.component';
import { AddUserRoleComponent } from './add-user-role/add-user-role.component';
import { EditUserRoleComponent } from './edit-user-role/edit-user-role.component';



@NgModule({
    declarations: [
        UserRoleComponent,
        AddEditUserRoleFormComponent,
        AddUserRoleComponent,
        EditUserRoleComponent 
    ],
    exports: [UserRoleComponent],
    imports: [UserRoleRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        AddEditUserRoleFormComponent,
        AddUserRoleComponent,
        EditUserRoleComponent 
    ]

})


export class UserRoleModule { }