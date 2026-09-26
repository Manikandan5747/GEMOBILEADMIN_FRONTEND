import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternalAppVersionRoutingModule } from './internal-app-version-routing.module';
import { InternalAppVersionComponent } from './internal-app-version.component';
import { AddEditInternalAppVersionComponent } from './add-edit-internal-app-version/add-edit-internal-app-version.component';
import { AddInternalAppVersionComponent } from './add-internal-app-version/add-internal-app-version.component';
import { EditInternalAppVersionComponent } from './edit-internal-app-version/edit-internal-app-version.component';
import { DemoMaterialModule } from "src/app/demo-material-module";


@NgModule({
  declarations: [
    InternalAppVersionComponent,
    AddEditInternalAppVersionComponent,
    AddInternalAppVersionComponent,
    EditInternalAppVersionComponent
  ],
  imports: [
    CommonModule,
    InternalAppVersionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
]
})
export class InternalAppVersionModule { }
