import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandComponent } from './brand.component';
import { ImportBrandComponent } from './import-brand/import-brand.component';

const routes: Routes = [
  { path: '', component: BrandComponent },
  { path: 'import-brand', component: ImportBrandComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }