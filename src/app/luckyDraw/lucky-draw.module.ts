import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CommonModule } from '@angular/common';

import { LuckyDrawRoutingModule } from './lucky-draw-routing.module';
import { CategoryMasterComponent } from './lucky-draw/category-master/category-master.component';
import { AddCategoryComponent } from './lucky-draw/category-master/add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ListInventoryComponent } from './lucky-inventory/list-inventory/list-inventory.component';
import { AddInventoryComponent } from './lucky-inventory/add-inventory/add-inventory.component';
import { KeyManagementComponent } from './key-draw-management/key-management/key-management.component';
import { CategoryTypeMasterComponent } from './category-type-master/category-type-master/category-type-master.component';



@NgModule({
  declarations: [
    CategoryMasterComponent,
    AddCategoryComponent,
    ListInventoryComponent,
    AddInventoryComponent,
    KeyManagementComponent,
    CategoryTypeMasterComponent,
  ],
  imports: [
    CommonModule, DemoMaterialModule ,   FormsModule,
    ReactiveFormsModule,DemoMaterialModule,
    LuckyDrawRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
],
})
export class LuckyDrawModule { }
