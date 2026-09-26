import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../demo-material-module';
import { UserPrivilegeComponent } from './user-privilege.component';
import { PrivilegeRoutingModule } from './user-privilege-routes';
import { RelatedModulePrivilegeComponent } from './related-module-privilege/related-module-privilege.component';
import { MiscelleneosRulesComponent } from './miscelleneos-rules/miscelleneos-rules.component';

@NgModule({
    declarations: [
       UserPrivilegeComponent,
       RelatedModulePrivilegeComponent,
       MiscelleneosRulesComponent
    ],
    exports: [UserPrivilegeComponent],
    imports: [
        PrivilegeRoutingModule,
        CommonModule,
        DemoMaterialModule,
        FormsModule,
        ReactiveFormsModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ],
   

})




export class GemotorsPrivilegeModule { }