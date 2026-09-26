import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { TestDriveComponent } from './test-drive.component';
import { TestDriveWindowComponent } from './test-drive-window/test-drive-window.component';
import { TestDriveRoutingModule } from './test-drive-routing.module';


@NgModule({
  declarations: [
    TestDriveComponent,
    TestDriveWindowComponent
  ], exports: [TestDriveComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      TestDriveRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class TestDriveModule { }
