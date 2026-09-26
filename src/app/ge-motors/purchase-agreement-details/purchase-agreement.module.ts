import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { PurchaseAgreementComponent } from './purchase-agreement/purchase-agreement.component';
import { PurchaseAgreementDetailsComponent } from './purchase-agreement-details.component';
import { PurchaseAgreementRoutingModule } from './purchase-agreement-routing.module';
import { SignLinkComponent } from './sign-link/sign-link.component';


@NgModule({
  declarations: [
    PurchaseAgreementDetailsComponent,
    PurchaseAgreementComponent,
    SignLinkComponent
  ], exports: [PurchaseAgreementDetailsComponent],
    imports: [
      CommonModule,MatSelectFilterModule,
      DemoMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      PurchaseAgreementRoutingModule
    ],
    schemas: [
      CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class PurchaseAgreementModule { }
