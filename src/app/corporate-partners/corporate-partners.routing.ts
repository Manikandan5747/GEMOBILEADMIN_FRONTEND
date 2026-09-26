import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorporatePartnersComponent } from './corporate-partners.component';
import { CorporateSpecialOfferComponent } from './corporate-special-offer/corporate-special-offer.component';



const routes: Routes = [
  { path: '', component: CorporatePartnersComponent },
  { path: 'special-offer', component: CorporateSpecialOfferComponent },
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporatePartnersRoutingModule { }