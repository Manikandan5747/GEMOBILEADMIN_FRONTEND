import { NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemoMaterialModule } from '../demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardComponent } from './dashboard.component';
import {  DashboardRoutingModule } from './dashboard.routing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PortalDashboardComponent } from './portal-dashboard/portal-dashboard.component';
import { ShowroomdashboardComponent } from './showroomdashboard/showroomdashboard.component';
import { GemotordashboardComponent } from './gemotordashboard/gemotordashboard/gemotordashboard.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { CardModule, } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DbShowroomManagerComponent } from './gemotordashboard/db-showroom-manager/db-showroom-manager.component';
@NgModule({
  declarations: [DashboardComponent, PortalDashboardComponent, ShowroomdashboardComponent, GemotordashboardComponent, DbShowroomManagerComponent],
  imports: [
    CommonModule, NgxChartsModule,ChartModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,CardModule,CalendarModule,FormsModule,

    DemoMaterialModule,  TableModule
,
    FlexLayoutModule,DashboardRoutingModule
  ], 
  

})
export class DashboardModule { }

