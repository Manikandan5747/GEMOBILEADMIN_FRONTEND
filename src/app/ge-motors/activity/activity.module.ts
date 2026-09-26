import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ActivityComponent } from './activity.component';
import { ActivityRoutingModule } from './activity-routing.module';
import { AddEditActivityComponent } from './add-edit-activity/add-edit-activity.component';
import { OpenActivityComponent } from './open-activity/open-activity.component';


@NgModule({
  declarations: [
    ActivityComponent,
    AddEditActivityComponent,
    OpenActivityComponent
    
  ], exports: [ActivityComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ActivityRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ActivityModule { }
