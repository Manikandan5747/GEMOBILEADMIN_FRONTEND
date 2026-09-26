import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEventTableRoutingModule } from './manage-event-table-routing.module';

import { AddEventTableFormComponent } from './add-event-table-form/add-event-table-form.component';
import { AddEditEventTableFormComponent } from './add-edit-event-table-form/add-edit-event-table-form.component';
import { EditEventTableFormComponent } from './edit-event-table-form/edit-event-table-form.component';
import { DemoMaterialModule } from '../demo-material-module';
// import { DesTextAreaComponent } from './des-text-area.component';
import { ManageEventTableComponent } from './manage-event-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AddEventTableFormComponent,
    AddEditEventTableFormComponent,
    EditEventTableFormComponent,
    ManageEventTableComponent
    

  ],
  exports: [ManageEventTableComponent],
   imports: [
     CommonModule,
     DemoMaterialModule,
     FormsModule,
     ReactiveFormsModule,
     ManageEventTableRoutingModule
   ],
   
       schemas: [
           CUSTOM_ELEMENTS_SCHEMA
       ],
        entryComponents: [  
               AddEventTableFormComponent,
               AddEditEventTableFormComponent,
               EditEventTableFormComponent
           ]
 })
export class ManageEventTableModule { }
