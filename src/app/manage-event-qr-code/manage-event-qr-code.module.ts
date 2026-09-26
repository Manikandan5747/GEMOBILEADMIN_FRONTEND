import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageEventQrCodeRoutingModule } from './manage-event-qr-code-routing.module';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';




import { DemoMaterialModule } from '../demo-material-module';
// import { DesTextAreaComponent } from './des-text-area.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageEventQrCodeComponent } from './manage-event-qr-code.component';

@NgModule({
  declarations: [
    ManageEventQrCodeComponent
  ],
 exports: [ManageEventQrCodeComponent],
   imports: [
     CommonModule,
     DemoMaterialModule,
     FormsModule,
     ReactiveFormsModule,
     ManageEventQrCodeRoutingModule
   ],
   
       schemas: [
           CUSTOM_ELEMENTS_SCHEMA
       ],
      
 })
export class ManageEventQrCodeModule { }
