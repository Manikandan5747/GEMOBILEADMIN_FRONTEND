import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServiceAdvisorComponent } from './service-advisor.component';



const routes: Routes = [
  { path: '', component: ServiceAdvisorComponent },
//   { path: 'special-offer', component: CorporateSpecialOfferComponent },
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceAdvisorRoutingModule { }