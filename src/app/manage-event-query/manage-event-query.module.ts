import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';



import { DemoMaterialModule } from '../demo-material-module';
import { AddEditEventQueryFormComponent } from './add-edit-event-query-form/add-edit-event-query-form.component';

import { EditEventQueryFormComponent } from './edit-event-query-form/edit-event-query-form.component';
import { ManageEventQueryRoutingModule } from './manage-event-query-routing.module';
// import { DesTextAreaComponent } from './des-text-area.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageEventQueryComponent } from './manage-event-query.component';


@NgModule({
  declarations: [
    ManageEventQueryComponent,
    AddEditEventQueryFormComponent,
    EditEventQueryFormComponent


  ],
  exports: [ManageEventQueryComponent],
   imports: [
     CommonModule,
     DemoMaterialModule,
     FormsModule,
     ReactiveFormsModule,
     ManageEventQueryRoutingModule
   ],
   
       schemas: [
           CUSTOM_ELEMENTS_SCHEMA
       ],
        entryComponents: [  
               AddEditEventQueryFormComponent,
               EditEventQueryFormComponent
           ]
 })
export class ManageEventQueryModule { }
