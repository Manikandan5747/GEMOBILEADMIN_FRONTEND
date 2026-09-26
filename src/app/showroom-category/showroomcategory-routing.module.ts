import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowroomCategoryComponent } from './showroom-category.component';

const routes: Routes = [{ path: '', component: ShowroomCategoryComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class showroomcategoryRoutingModule { }