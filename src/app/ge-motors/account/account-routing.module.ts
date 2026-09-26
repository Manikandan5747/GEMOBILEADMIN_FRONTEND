import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { AddEditAccountComponent } from './add-edit-account/add-edit-account.component';


const routes: Routes = [
  { path: '', component: ContactComponent },
  { path: 'create-account', component: AddEditAccountComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
