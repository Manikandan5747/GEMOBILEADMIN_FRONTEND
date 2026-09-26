import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueBrandModelComponent } from './catalogue-brand-model.component';

const routes: Routes = [
  { path: '', component: CatalogueBrandModelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueBrandModelRoutingModule { }