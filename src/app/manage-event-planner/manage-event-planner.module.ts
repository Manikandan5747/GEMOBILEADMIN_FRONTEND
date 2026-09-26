import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { ManageEventPlannerRoutingModule } from './manage-event-planner-routing.module';
import { MatIconModule } from '@angular/material/icon';  

import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';


import { DemoMaterialModule } from '../demo-material-module';
import { AddEditEventPlannerFormComponent } from './add-edit-event-planner-form/add-edit-event-planner-form.component';
import { AddEventPlannerFormComponent } from './add-event-planner-form/add-event-planner-form.component';
import { EditEventPlannerFormComponent } from './edit-event-planner-form/edit-event-planner-form.component';
// import { DesTextAreaComponent } from './des-text-area.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageEventPlannerComponent ,ExcelGuidelinesSnackbarComponent} from './manage-event-planner.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AddEventPlannerFormComponent,
    AddEditEventPlannerFormComponent,
    EditEventPlannerFormComponent,
    ManageEventPlannerComponent,
    ExcelGuidelinesSnackbarComponent,
    
  ],
 exports: [ManageEventPlannerComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ManageEventPlannerRoutingModule,
     MatSnackBarModule,
  MatIconModule,
  MatButtonModule,
  HttpClientModule
  ],
  
      schemas: [
          CUSTOM_ELEMENTS_SCHEMA
      ],
       entryComponents: [  
            AddEventPlannerFormComponent,
            AddEditEventPlannerFormComponent,
            EditEventPlannerFormComponent,
            ExcelGuidelinesSnackbarComponent
          ]
})
export class ManageEventPlannerModule { }
