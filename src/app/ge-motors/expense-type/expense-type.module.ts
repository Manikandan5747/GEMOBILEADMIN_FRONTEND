import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { ExpenseTypeComponent } from './expense-type.component';
import { ExpenseTypeConfigRoutingModule } from './expense-type.routing.module';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { EditExpenseComponent } from './edit-expense/edit-expense.component';
import { AddEditExpenseFormComponent } from './add-edit-expense-form/add-edit-expense-form.component';


@NgModule({
  declarations: [
    ExpenseTypeComponent, 
    AddExpenseComponent,
    EditExpenseComponent,
    AddEditExpenseFormComponent 
  ], exports: [ExpenseTypeComponent],
    imports: [
      CommonModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      ExpenseTypeConfigRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class ExpenseTypeConfigModule { }
