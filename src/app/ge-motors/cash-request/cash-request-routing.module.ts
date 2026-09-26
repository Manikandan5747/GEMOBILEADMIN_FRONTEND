import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CashRequestComponent } from './cash-request.component';
import { AddEditCashRequestComponent } from './add-edit-cash-request/add-edit-cash-request.component';

const routes: Routes = [
    { path: '', component: CashRequestComponent },
    { path: 'create-cash-req', component: AddEditCashRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CashRequestRoutingModule { }
