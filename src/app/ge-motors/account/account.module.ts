import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AccountRoutingModule } from './account-routing.module';
import { ContactComponent } from './contact.component';
import { AddContactFormComponent } from './add-contact-form/add-contact-form.component';
import { AddEditContactFormComponent } from './add-edit-contact-form/add-edit-contact-form.component';
import { EditContactFormComponent } from './edit-contact-form/edit-contact-form.component';
import { AddEditAccountComponent } from './add-edit-account/add-edit-account.component';


@NgModule({
  declarations: [
    ContactComponent,
    AddContactFormComponent,
    AddEditContactFormComponent,
    EditContactFormComponent,
    AddEditAccountComponent 
  ], exports: [ContactComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      AccountRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AccountModule { }
