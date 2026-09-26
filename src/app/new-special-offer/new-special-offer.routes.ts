import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewSpecialOfferComponent } from './new-special-offer.component';



const routes: Routes = [
  { path: '', component: NewSpecialOfferComponent },
//   { path: 'special-offer', component: CorporateSpecialOfferComponent },
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewSpecialOfferRoutingModule { }