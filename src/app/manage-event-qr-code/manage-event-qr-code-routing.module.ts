import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEventQrCodeComponent } from './manage-event-qr-code.component';

const routes: Routes = [
  { path: '', component: ManageEventQrCodeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageEventQrCodeRoutingModule { }
