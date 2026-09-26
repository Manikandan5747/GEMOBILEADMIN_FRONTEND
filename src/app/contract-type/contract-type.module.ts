import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ContractTypeComponent } from './contract-type.component';
import { ContractTypeRoutingModule } from './contract-type.routing.module';

@NgModule({
  declarations: [
    ContractTypeComponent
    
  ], exports: [ContractTypeComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ContractTypeRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ContractTypeModule { }
