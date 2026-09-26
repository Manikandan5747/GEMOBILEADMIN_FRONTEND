import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseAgreementDetailsComponent } from './purchase-agreement-details.component';
import { PurchaseAgreementComponent } from './purchase-agreement/purchase-agreement.component';

const routes: Routes = [{ path: '', component: PurchaseAgreementDetailsComponent },
    { path: 'contract', component: PurchaseAgreementComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseAgreementRoutingModule { }
