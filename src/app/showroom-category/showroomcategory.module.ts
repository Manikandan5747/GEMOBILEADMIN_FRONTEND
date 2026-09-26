import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ShowroomCategoryComponent } from './showroom-category.component';
import { showroomcategoryRoutingModule } from './showroomcategory-routing.module';
import { AddEditShowroomCategoryFormComponent } from './add-edit-showroom-category-form/add-edit-showroom-category-form.component';
import { AddShowroomCategoryComponent } from './add-showroom-category/add-showroom-category.component';
import { EditShowroomCategoryComponent } from './edit-showroom-category/edit-showroom-category.component';

@NgModule({
  declarations: [
    ShowroomCategoryComponent,
    AddEditShowroomCategoryFormComponent,
    AddShowroomCategoryComponent,
    EditShowroomCategoryComponent,
    
  ], exports: [ShowroomCategoryComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      showroomcategoryRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ShowroomCategoryModule { }
