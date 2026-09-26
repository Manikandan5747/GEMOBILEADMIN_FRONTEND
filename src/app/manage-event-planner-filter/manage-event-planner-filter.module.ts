import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageEventPlannerFilterRoutingModule } from './manage-event-planner-filter-routing.module';

import { DemoMaterialModule } from '../demo-material-module';
import { AddEditEventPlannerFilterFormComponent } from './add-edit-event-planner-filter-form/add-edit-event-planner-filter-form.component';
import { AddEventPlannerFilterFormComponent } from './add-event-planner-filter-form/add-event-planner-filter-form.component';

import { ManageEventPlannerFilterComponent } from './manage-event-planner-filter.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    AddEventPlannerFilterFormComponent,
    ManageEventPlannerFilterComponent,
    AddEditEventPlannerFilterFormComponent
  ],
  exports: [ManageEventPlannerFilterComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ManageEventPlannerFilterRoutingModule,

    MatFormFieldModule,
    MatInputModule,
      MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    AddEventPlannerFilterFormComponent,
    AddEditEventPlannerFilterFormComponent,
  
  ]
})
export class ManageEventPlannerFilterModule { }
