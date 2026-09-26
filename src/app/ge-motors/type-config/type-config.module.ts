import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { TypeConfigComponent } from './type-config.component';
import { AddEditTypeFormComponent } from './add-edit-type-form/add-edit-type-form.component';
import { AddTypeFormComponent } from './add-type-form/add-type-form.component';
import { EditTypeFormComponent } from './edit-type-form/edit-type-form.component';
import { TypeConfigRoutingModule } from './type-config-routing.module';


@NgModule({
  declarations: [
    TypeConfigComponent,
    AddEditTypeFormComponent,
    AddTypeFormComponent,
    EditTypeFormComponent    
  ], exports: [TypeConfigComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      TypeConfigRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class TypeConfigModule { }
