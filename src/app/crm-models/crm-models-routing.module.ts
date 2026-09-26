import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrmModelsComponent } from './crm-models.component';



const routes: Routes = [
  { path: '', component: CrmModelsComponent },
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmModelsRoutingModule { }
