import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';



import { ManageEventTemplateRoutingModule } from './manage-event-template-routing.module';
import { AddEventTemplateFormComponent } from './add-event-template-form/add-event-template-form.component';
import { AddEditEventTemplateFormComponent, SleekflowTemplateName, TemplateGuideSnackbarInline, TemplateNameSnackbarInline } from './add-edit-event-template-form/add-edit-event-template-form.component';
import { EditEventTemplateFormComponent } from './edit-event-template-form/edit-event-template-form.component';
import { DemoMaterialModule } from '../demo-material-module';
// import { DesTextAreaComponent } from './des-text-area.component';
import { ManageEventTemplateComponent } from './manage-event-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ManageEventTemplateComponent,
    EditEventTemplateFormComponent,
    AddEditEventTemplateFormComponent,
    AddEventTemplateFormComponent,
    TemplateGuideSnackbarInline,
    TemplateNameSnackbarInline,
    SleekflowTemplateName

  ],
   exports: [ManageEventTemplateComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ManageEventTemplateRoutingModule
    ],
    
        schemas: [
            CUSTOM_ELEMENTS_SCHEMA
        ],
         entryComponents: [  
                EditEventTemplateFormComponent,
                AddEditEventTemplateFormComponent,
                AddEventTemplateFormComponent
            ]
  })

export class ManageEventTemplateModule { }
