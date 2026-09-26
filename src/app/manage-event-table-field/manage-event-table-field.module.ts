import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageEventTableFieldRoutingModule } from './manage-event-table-field-routing.module';



import { DemoMaterialModule } from '../demo-material-module';
// import { DesTextAreaComponent } from './des-text-area.component';
import { ManageEventTableFieldComponent } from './manage-event-table-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditEventTableFieldFormComponent } from './add-edit-event-table-field-form/add-edit-event-table-field-form.component';
import { EditEventTableFieldFormComponent } from './edit-event-table-field-form/edit-event-table-field-form.component';
import { AddEventTableFieldFormComponent } from './add-event-table-field-form/add-event-table-field-form.component';



@NgModule({
  declarations: [
    ManageEventTableFieldComponent,
    AddEditEventTableFieldFormComponent,
    EditEventTableFieldFormComponent,
    AddEventTableFieldFormComponent
  ],
  imports: [
    CommonModule,
    ManageEventTableFieldRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ]
})
export class ManageEventTableFieldModule { }
