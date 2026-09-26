import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { StageComponent } from './stage.component';
import { AddEditStageComponent } from './add-edit-stage/add-edit-stage.component';
import { StageRoutingModule } from './stage-routing.module';


@NgModule({
  declarations: [
    StageComponent,
    AddEditStageComponent
  ], exports: [StageComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      StageRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class StageModule { }
