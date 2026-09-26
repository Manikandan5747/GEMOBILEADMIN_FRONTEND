import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShortLinksComponent } from './short-links.component';

const routes: Routes = [
  { path: '', component: ShortLinksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShortLinkRoutingModule { }