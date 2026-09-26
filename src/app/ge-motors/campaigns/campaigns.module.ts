import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AddCampaignsFormComponent } from './add-campaigns-form/add-campaigns-form.component';
import { CampaignsRoutingModule } from './campaigns-routing.module';
import { AddEditCampaignsFormComponent } from './add-edit-campaigns-form/add-edit-campaigns-form.component';
import { EditCampaignsFormComponent } from './edit-campaigns-form/edit-campaigns-form.component';
import { CampaignsComponent } from './campaigns.component';


@NgModule({
  declarations: [
    CampaignsComponent,
    AddCampaignsFormComponent,
    AddEditCampaignsFormComponent,
    EditCampaignsFormComponent

  ], exports: [CampaignsComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      CampaignsRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class CampaignsModule { }
