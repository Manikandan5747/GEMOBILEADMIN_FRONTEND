import { DashboardComponent } from './dashboard.component';
import { PortalDashboardComponent } from './portal-dashboard/portal-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowroomdashboardComponent } from './showroomdashboard/showroomdashboard.component';
// import { GemotordashboardComponent } from './gemotordashboard/gemotordashboard/gemotordashboard.component';

const routes: Routes =   [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'portal',
    component: PortalDashboardComponent
  },
  {
    path: 'showroom',
    component: ShowroomdashboardComponent
  },
  // {
  //   path: 'gemotor',
  //   component: GemotordashboardComponent
  // },


  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
