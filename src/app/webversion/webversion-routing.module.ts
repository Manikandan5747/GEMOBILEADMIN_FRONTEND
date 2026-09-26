import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebversionComponent } from './webversion/webversion.component';


const routes: Routes = [{ path: '', component: WebversionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebversionRoutingModule { }
