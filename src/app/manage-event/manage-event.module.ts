import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEventRoutingModule } from './manage-event-routing.module';
import { AddManageEventComponent } from './add-manage-event/add-manage-event.component';
import { AddEditEventFormComponent } from './add-edit-event-form/add-edit-event-form.component';
import { EditManageEventComponent } from './edit-event-form/edit-event-form.component';
import { DemoMaterialModule } from '../demo-material-module';
// import { DesTextAreaComponent } from './des-text-area.component';
import { ManageEventComponent } from './manage-event.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ManageEventComponent,
    AddManageEventComponent,
    AddEditEventFormComponent,
    EditManageEventComponent,
    //DesTextAreaComponent,
    
  ],
  exports: [ManageEventComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ManageEventRoutingModule
  ],
  
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ],
       entryComponents: [  
              AddManageEventComponent,
              AddEditEventFormComponent,
              EditManageEventComponent
          ]
})
export class ManageEventModule { }
