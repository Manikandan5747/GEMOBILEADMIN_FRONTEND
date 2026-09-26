import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { CityComponent } from './city.component';
import { CityRoutingModule } from './city-routing.module';
import { AddEditCityFormComponent } from './add-edit-city-form/add-edit-city-form.component';
import { AddCityComponent } from './add-city/add-city.component';
import { EditCityComponent } from './edit-city/edit-city.component';

@NgModule({
  declarations: [
    CityComponent,
    AddEditCityFormComponent,
    AddCityComponent,
    EditCityComponent,
    
  ], exports: [CityComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      CityRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CityModule { }
