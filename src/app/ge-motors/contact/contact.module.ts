import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact-routing.module';
import { AddContactFormComponent } from './add-contact-form/add-contact-form.component';
import { AddEditContactFormComponent } from './add-edit-contact-form/add-edit-contact-form.component';
import { EditContactFormComponent } from './edit-contact-form/edit-contact-form.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AddEditContactComponent } from './add-edit-contact/add-edit-contact.component';


@NgModule({
  declarations: [
    ContactComponent,
    AddContactFormComponent,
    AddEditContactFormComponent,
    EditContactFormComponent,
    AddEditContactComponent 
  ], exports: [ContactComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ContactRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ContactModule { }
