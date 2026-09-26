import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpportunityComponent } from './opportunity.component';
import { TestDriveComponent } from './test-drive/test-drive.component';

const routes: Routes = [
  { path: '', component: OpportunityComponent },
  { path: 'test-drive', component: TestDriveComponent },

  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunityRoutingModule { }
