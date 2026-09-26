
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryMasterComponent } from './lucky-draw/category-master/category-master.component';
import { AddCategoryComponent } from './lucky-draw/category-master/add-category/add-category.component';
import { ListInventoryComponent } from './lucky-inventory/list-inventory/list-inventory.component';
import { AddInventoryComponent } from './lucky-inventory/add-inventory/add-inventory.component';
import { KeyManagementComponent } from './key-draw-management/key-management/key-management.component';
import { CategoryTypeMasterComponent } from './category-type-master/category-type-master/category-type-master.component';
import { AuthGuard } from '../shared/accordion/auth.guard';



const routes: Routes = [
{ path: 'listCategory', component: CategoryMasterComponent,
  canActivate: [AuthGuard],
 },
{ path: 'addLuckyCategory', component: AddCategoryComponent },
{ path: 'listInventory', component: ListInventoryComponent ,
  canActivate: [AuthGuard],
},
{ path: 'addLuckyInventory', component: AddInventoryComponent },
{ path: 'keyDraw', component: KeyManagementComponent ,
  canActivate: [AuthGuard],
},
{ path: 'CategoryType', component: CategoryTypeMasterComponent },

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LuckyDrawRoutingModule { }
