import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebversionRoutingModule } from './webversion-routing.module';
import { WebversionComponent } from './webversion/webversion.component';
import { AddEditWebversionFormComponent } from './webversion/add-edit-webversion-form/add-edit-webversion-form.component';
import { AddWebversionComponent } from './webversion/add-webversion/add-webversion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [
    WebversionComponent,
    AddEditWebversionFormComponent,
    AddWebversionComponent
  ],

  imports: [
    CommonModule,
    WebversionRoutingModule,
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

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
],
  entryComponents:[
    AddWebversionComponent,
    AddEditWebversionFormComponent
  ]

})
export class WebversionModule { }
