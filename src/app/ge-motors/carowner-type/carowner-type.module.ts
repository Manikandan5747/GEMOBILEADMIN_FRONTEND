import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CarownerTypeConfigRoutingModule } from './carowner-type-routing.module';
import { CarownerTypeComponent } from './carowner-type.component';
import { AddCarownerTypeComponent } from './add-carowner-type/add-carowner-type.component';
import { AddEditCarownerTypeFormComponent } from './add-edit-carowner-type-form/add-edit-carowner-type-form.component';
import { EditCarownerTypeComponent } from './edit-carowner-type/edit-carowner-type.component';


@NgModule({
  declarations: [
    CarownerTypeComponent,
    AddCarownerTypeComponent,
    AddEditCarownerTypeFormComponent,
    EditCarownerTypeComponent
  ], exports: [CarownerTypeComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CarownerTypeConfigRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CarownerTypeConfigModule { }
