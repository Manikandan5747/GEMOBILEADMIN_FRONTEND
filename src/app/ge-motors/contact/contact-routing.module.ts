import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { AddEditContactComponent } from './add-edit-contact/add-edit-contact.component';

const routes: Routes = [
  { path: '', component: ContactComponent },
  { path: 'create-contact', component: AddEditContactComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
