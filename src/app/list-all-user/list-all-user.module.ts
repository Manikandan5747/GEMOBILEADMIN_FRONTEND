import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { ListAllUserComponent } from './list-all-user.component';
import { LoginRoutingModule } from './list-all-user-routing.module';
import { CreateLoginComponent } from './create-login/create-login.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
    declarations: [
        ListAllUserComponent,
        CreateLoginComponent    
     
    ],
    exports: [ListAllUserComponent],
    imports: [LoginRoutingModule,
        CommonModule,
        DemoMaterialModule,ClipboardModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectFilterModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
    entryComponents: [  
        CreateLoginComponent
    ]

})




export class ListUserModule { }