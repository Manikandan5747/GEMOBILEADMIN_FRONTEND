import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsandconditionsRoutingModule } from './termsandconditions-routing.module';
import { TermsandconditionsComponent } from './termsandconditions/termsandconditions.component';
import { AddTermsandconditionsComponent } from './termsandconditions/add-termsandconditions/add-termsandconditions.component';
import { EditTermsandconditionsComponent } from './termsandconditions/edit-termsandconditions/edit-termsandconditions.component';
import { AddEditTermsandconditionsComponent } from './termsandconditions/add-edit-termsandconditions/add-edit-termsandconditions.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';




@NgModule({
  declarations: [
    TermsandconditionsComponent,
    AddTermsandconditionsComponent,
    EditTermsandconditionsComponent,
    AddEditTermsandconditionsComponent
  ],
  imports: [
    CommonModule,
    TermsandconditionsRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DragDropModule ,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDatepickerModule


  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
]

})
export class TermsandconditionsModule { }
